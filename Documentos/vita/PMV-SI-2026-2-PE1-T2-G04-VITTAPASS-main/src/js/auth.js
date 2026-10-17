/*
 * VittaPass — Autenticação (cadastro e login de clientes e parceiros).
 *
 * Persistência:
 *   - LocalStorage do navegador (chave "vittapass-db").
 *   - Sessão em sessionStorage ou localStorage (chave "vittapass-session").
 *
 * Arquitetura baseada em classes e Programação Orientada a Objetos (POO).
 */

'use strict';

/* ==========================================================================
   Configuração
   ========================================================================== */

class AuthConfig {
  static STORAGE_KEY = 'vittapass-db';
  static SESSION_KEY = 'vittapass-session';
  static COLLECTIONS = ['usuarios', 'estabelecimentos'];

  static ROLES = Object.freeze({
    CLIENTE: 'cliente',
    PARCEIRO: 'gestor_parceiro'
  });

  static REDIRECTS = Object.freeze({
    cliente: '../Users/home.html',
    gestor_parceiro: '../Estabelecimento/dashboard.html'
  });
}

/* ==========================================================================
   Erros
   ========================================================================== */

class AuthError extends Error {
  /**
   * @param {string} message Mensagem exibida ao usuário.
   * @param {string|null} field id do campo relacionado ao erro (opcional).
   */
  constructor(message, field = null) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

/* ==========================================================================
   Utilitários e Validações
   ========================================================================== */

class Validator {
  static onlyDigits(value = '') {
    return String(value).replace(/\D/g, '');
  }

  static isFilled(value) {
    return String(value ?? '').trim().length > 0;
  }

  static isFullName(value = '') {
    return value.trim().split(/\s+/).filter(Boolean).length >= 2;
  }

  static isEmail(value = '') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  /** Pelo menos 8 caracteres, com letras e números. */
  static isStrongPassword(value = '') {
    return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
  }

  static isPhone(value = '') {
    const digits = Validator.onlyDigits(value);
    return digits.length === 10 || digits.length === 11;
  }

  static isCPF(value = '') {
    const cpf = Validator.onlyDigits(value);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const digit = (length) => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += Number(cpf[i]) * (length + 1 - i);
      }
      const rest = (sum * 10) % 11;
      return rest === 10 ? 0 : rest;
    };

    return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
  }

  static isCNPJ(value = '') {
    const cnpj = Validator.onlyDigits(value);
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    const digit = (length) => {
      const weights = length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const sum = weights.reduce((acc, w, i) => acc + Number(cnpj[i]) * w, 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    return digit(12) === Number(cnpj[12]) && digit(13) === Number(cnpj[13]);
  }
}

class InputMask {
  static phone(value = '') {
    const d = Validator.onlyDigits(value).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  /** Aplica a máscara de telefone enquanto o usuário digita. */
  static attachPhone(input) {
    if (!input) return;
    input.addEventListener('input', () => {
      input.value = InputMask.phone(input.value);
    });
  }
}

class IdGenerator {
  static generate(prefix) {
    const random = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
    return `${prefix}_${random}`;
  }
}

class PasswordHasher {
  static createSalt() {
    const bytes = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
    }
    return PasswordHasher.#toHex(bytes);
  }

  /** SHA-256(salt + senha). Usa um hash simples se a Web Crypto API não existir. */
  static async hash(password, salt) {
    const input = `${salt}:${password}`;

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
      return PasswordHasher.#toHex(new Uint8Array(buffer));
    }

    console.warn('[auth] Web Crypto indisponível: usando hash de fallback.');
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return `fnv_${h.toString(16)}`;
  }

  static async verify(password, salt, expectedHash) {
    return (await PasswordHasher.hash(password, salt)) === expectedHash;
  }

  static #toHex(bytes) {
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
}

/* ==========================================================================
   Modelos de Domínio (OOP)
   ========================================================================== */

class User {
  constructor({
    id = IdGenerator.generate('usr'),
    nome,
    documentoNumero,
    email,
    telefone = null,
    senhaHash,
    senhaSalt,
    papeis = [],
    status = 'ativo',
    emailVerificado = false,
    perfil = { descricao: null, avatarUrl: null, cidade: null, uf: null },
    criadoEm = new Date().toISOString(),
    atualizadoEm = criadoEm,
    excluidoEm = null
  }) {
    this.id = id;
    this.nome = nome.trim();
    this.documentoTipo = 'cpf';
    this.documentoNumero = Validator.onlyDigits(documentoNumero);
    this.email = email.trim().toLowerCase();
    this.telefone = User.normalizePhone(telefone);
    this.senhaHash = senhaHash;
    this.senhaSalt = senhaSalt;
    this.papeis = papeis;
    this.status = status;
    this.emailVerificado = emailVerificado;
    this.perfil = perfil;
    this.criadoEm = criadoEm;
    this.atualizadoEm = atualizadoEm;
    this.excluidoEm = excluidoEm;
  }

  hasRole(role) {
    return this.papeis.includes(role);
  }

  /** Converte "(31) 99999-0000" em "+5531999990000" */
  static normalizePhone(telefone) {
    if (!telefone) return null;
    if (String(telefone).startsWith('+')) return telefone;
    return `+55${Validator.onlyDigits(telefone)}`;
  }

  /** Dados seguros para guardar na sessão (sem hash de senha). */
  toSession() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      papeis: [...this.papeis]
    };
  }

  toJSON() {
    return { ...this };
  }

  /** Recria a instância correta a partir de um registro salvo. */
  static fromRecord(record) {
    if (record.papeis?.includes(AuthConfig.ROLES.PARCEIRO)) {
      return new Parceiro(record);
    }
    return new Cliente(record);
  }
}

class Cliente extends User {
  constructor(data) {
    super({ ...data, papeis: [AuthConfig.ROLES.CLIENTE] });
    this.perfil = { ...this.perfil, descricao: this.perfil.descricao ?? 'Cliente VittaPass.' };
  }
}

class Parceiro extends User {
  constructor(data) {
    super({ ...data, papeis: [AuthConfig.ROLES.PARCEIRO] });
    this.perfil = { ...this.perfil, descricao: this.perfil.descricao ?? 'Gestor de estabelecimento parceiro.' };
  }
}

class Estabelecimento {
  constructor({
    id = IdGenerator.generate('est'),
    gestorUsuarioId,
    razaoSocial,
    nomeFantasia = razaoSocial,
    documentoNumero,
    categoriaPrincipal,
    telefonePublico = null,
    emailPublico = null,
    criadoEm = new Date().toISOString()
  }) {
    this.id = id;
    this.gestorUsuarioId = gestorUsuarioId;
    this.razaoSocial = razaoSocial.trim();
    this.nomeFantasia = nomeFantasia.trim();
    this.pessoaTipo = 'cnpj';
    this.documentoNumero = Validator.onlyDigits(documentoNumero);
    this.categoriaPrincipal = categoriaPrincipal;
    this.descricao = null;
    this.nivelParceiro = 1;
    this.participaVittaPass = true;
    this.telefonePublico = telefonePublico;
    this.emailPublico = emailPublico;
    this.endereco = null;
    this.timeZone = 'America/Sao_Paulo';
    this.formasPagamento = [];
    this.logoUrl = null;
    this.fotosUrls = [];
    this.statusAprovacao = 'pendente';
    this.notaMedia = 0;
    this.quantidadeAvaliacoes = 0;
    this.criadoEm = criadoEm;
    this.atualizadoEm = criadoEm;
    this.excluidoEm = null;
  }

  toJSON() {
    return { ...this };
  }
}

/* ==========================================================================
   Persistência: Banco de Dados em LocalStorage
   ========================================================================== */

class LocalStorageDB {
  #key;

  constructor(key = AuthConfig.STORAGE_KEY) {
    this.#key = key;
    if (!localStorage.getItem(this.#key)) {
      this.#write(LocalStorageDB.emptySchema());
    }
  }

  static emptySchema() {
    const schema = {
      metadados: {
        schemaVersion: '1.0.0',
        descricao: 'Base de autenticação do protótipo VittaPass (LocalStorage)',
        atualizadoEm: new Date().toISOString()
      }
    };
    AuthConfig.COLLECTIONS.forEach((name) => { schema[name] = []; });
    return schema;
  }

  snapshot() {
    try {
      const data = JSON.parse(localStorage.getItem(this.#key));
      return { ...LocalStorageDB.emptySchema(), ...data };
    } catch {
      return LocalStorageDB.emptySchema();
    }
  }

  getAll(collection) {
    return [...(this.snapshot()[collection] ?? [])];
  }

  findOne(collection, predicate) {
    return this.getAll(collection).find(predicate) ?? null;
  }

  insert(collection, record) {
    const data = this.snapshot();
    data[collection] = [...(data[collection] ?? []), record];
    this.#write(data);
    return record;
  }

  insertMany(entries) {
    const data = this.snapshot();
    entries.forEach(({ collection, record }) => {
      data[collection] = [...(data[collection] ?? []), record];
    });
    this.#write(data);
    return true;
  }

  ready() {
    return Promise.resolve();
  }

  #write(data) {
    data.metadados = { ...data.metadados, atualizadoEm: new Date().toISOString() };
    localStorage.setItem(this.#key, JSON.stringify(data));
  }
}

/** Alias para a camada de banco de dados */
class Database extends LocalStorageDB {}

/* ==========================================================================
   Sessão e Serviço de Autenticação
   ========================================================================== */

class SessionManager {
  #key;

  constructor(key = AuthConfig.SESSION_KEY) {
    this.#key = key;
  }

  start(user, remember = false) {
    this.end();
    const session = { ...user.toSession(), iniciadaEm: new Date().toISOString() };
    (remember ? localStorage : sessionStorage).setItem(this.#key, JSON.stringify(session));
    return session;
  }

  current() {
    const raw = sessionStorage.getItem(this.#key) ?? localStorage.getItem(this.#key);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    return this.current() !== null;
  }

  end() {
    sessionStorage.removeItem(this.#key);
    localStorage.removeItem(this.#key);
  }
}

class AuthService {
  #db;
  #session;

  constructor(db = new Database(), session = new SessionManager()) {
    this.#db = db;
    this.#session = session;
  }

  get session() {
    return this.#session;
  }

  /** Cadastra um cliente no LocalStorage. */
  async registerCliente({ nome, cpf, email, senha, consentimento }) {
    await this.#db.ready();

    this.#validatePerson({
      nome,
      cpf,
      email,
      senha,
      nameField: 'regName',
      cpfField: 'regCpf',
      emailField: 'regMail',
      passField: 'regPass'
    });

    if (!consentimento) {
      throw new AuthError('Você precisa aceitar os Termos de Uso e a Política de Privacidade.', 'checkboxConsent');
    }

    this.#ensureUnique({ email, cpf, emailField: 'regMail', cpfField: 'regCpf' });

    const senhaSalt = PasswordHasher.createSalt();
    const senhaHash = await PasswordHasher.hash(senha, senhaSalt);
    const cliente = new Cliente({ nome, documentoNumero: cpf, email, senhaHash, senhaSalt });

    this.#db.insertMany([{ collection: 'usuarios', record: cliente.toJSON() }]);
    this.#session.start(cliente);
    return { user: cliente };
  }

  /** Cadastra o responsável (parceiro) e seu estabelecimento no LocalStorage. */
  async registerParceiro({ nome, cpf, email, telefone, senha, razaoSocial, cnpj, categoria }) {
    await this.#db.ready();

    this.#validatePerson({
      nome,
      cpf,
      email,
      senha,
      nameField: 'respNome',
      cpfField: 'respCpf',
      emailField: 'respEmail',
      passField: 'password'
    });

    if (!Validator.isPhone(telefone)) throw new AuthError('Informe um telefone válido com DDD.', 'respTelefone');
    if (!Validator.isFilled(razaoSocial)) throw new AuthError('Informe a razão social.', 'razaoSocial');
    if (!Validator.isCNPJ(cnpj)) throw new AuthError('Informe um CNPJ válido.', 'documento');
    if (!Validator.isFilled(categoria)) throw new AuthError('Selecione a categoria principal.', 'categoriaPrincipal');

    this.#ensureUnique({ email, cpf, emailField: 'respEmail', cpfField: 'respCpf' });

    const cnpjDigits = Validator.onlyDigits(cnpj);
    if (this.#db.findOne('estabelecimentos', (e) => e.documentoNumero === cnpjDigits)) {
      throw new AuthError('Já existe um estabelecimento cadastrado com este CNPJ.', 'documento');
    }

    const senhaSalt = PasswordHasher.createSalt();
    const senhaHash = await PasswordHasher.hash(senha, senhaSalt);
    const parceiro = new Parceiro({ nome, documentoNumero: cpf, email, telefone, senhaHash, senhaSalt });
    const estabelecimento = new Estabelecimento({
      gestorUsuarioId: parceiro.id,
      razaoSocial,
      documentoNumero: cnpj,
      categoriaPrincipal: categoria,
      telefonePublico: parceiro.telefone,
      emailPublico: parceiro.email
    });

    this.#db.insertMany([
      { collection: 'usuarios', record: parceiro.toJSON() },
      { collection: 'estabelecimentos', record: estabelecimento.toJSON() }
    ]);

    this.#session.start(parceiro);
    return { user: parceiro, estabelecimento };
  }

  /**
   * Autentica um usuário com o papel esperado.
   * @param {{ email: string, senha: string, role: string, remember?: boolean, emailField: string, passField: string }} params
   */
  async login({ email, senha, role, remember = false, emailField, passField }) {
    await this.#db.ready();

    if (!Validator.isEmail(email)) throw new AuthError('Informe um e-mail válido.', emailField);
    if (!Validator.isFilled(senha)) throw new AuthError('Informe sua senha.', passField);

    const normalized = email.trim().toLowerCase();
    const record = this.#db.findOne('usuarios', (u) => u.email === normalized && !u.excluidoEm);
    const invalid = new AuthError('E-mail ou senha incorretos.', passField);

    if (!record || !record.senhaHash) throw invalid;
    if (!(await PasswordHasher.verify(senha, record.senhaSalt, record.senhaHash))) throw invalid;

    const user = User.fromRecord(record);
    if (!user.hasRole(role)) {
      const message = role === AuthConfig.ROLES.PARCEIRO
        ? 'Esta conta é de cliente. Use o login "Sou Cliente".'
        : 'Esta conta é de parceiro. Use o login "Sou Parceiro".';
      throw new AuthError(message, emailField);
    }
    if (user.status !== 'ativo') throw new AuthError('Esta conta está inativa.', emailField);

    this.#session.start(user, remember);
    return user;
  }

  logout() {
    this.#session.end();
  }

  #validatePerson({ nome, cpf, email, senha, nameField, cpfField, emailField, passField }) {
    if (!Validator.isFullName(nome)) throw new AuthError('Informe seu nome completo.', nameField);
    if (!Validator.isCPF(cpf)) throw new AuthError('Informe um CPF válido.', cpfField);
    if (!Validator.isEmail(email)) throw new AuthError('Informe um e-mail válido.', emailField);
    if (!Validator.isStrongPassword(senha)) {
      throw new AuthError('A senha precisa ter pelo menos 8 caracteres, com letras e números.', passField);
    }
  }

  #ensureUnique({ email, cpf, emailField, cpfField }) {
    const normalized = email.trim().toLowerCase();
    const cpfDigits = Validator.onlyDigits(cpf);
    if (this.#db.findOne('usuarios', (u) => u.email === normalized)) {
      throw new AuthError('Este e-mail já está cadastrado.', emailField);
    }
    if (this.#db.findOne('usuarios', (u) => u.documentoNumero === cpfDigits)) {
      throw new AuthError('Este CPF já está cadastrado.', cpfField);
    }
  }
}

/* ==========================================================================
   Formulários (Camada de Interface)
   ========================================================================== */

/** Classe base com comportamentos comuns a todos os formulários. */
class AuthForm {
  form;
  auth;
  #submitButton;
  #submitLabel;
  #alert;

  constructor(form, auth) {
    this.form = form;
    this.auth = auth;
    this.#submitButton = form.querySelector('[type="submit"]');
    this.#submitLabel = this.#submitButton?.textContent.trim();

    this.form.setAttribute('novalidate', '');
    this.form.addEventListener('submit', (event) => this.#handleSubmit(event));
    this.form.addEventListener('input', (event) => this.clearFieldError(event.target));
    this.form.addEventListener('change', (event) => this.clearFieldError(event.target));
  }

  /** Implementado pelas subclasses. */
  async submit() {
    throw new Error('submit() deve ser implementado pela subclasse.');
  }

  value(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.type === 'checkbox' ? el.checked : el.value;
  }

  showMessage(message, type = 'error') {
    if (!this.#alert) {
      this.#alert = document.createElement('div');
      this.#alert.setAttribute('role', 'alert');
      this.form.prepend(this.#alert);
    }
    this.#alert.className = `form-alert form-alert--${type}`;
    this.#alert.textContent = message;
    this.#alert.hidden = false;
  }

  hideMessage() {
    if (this.#alert) this.#alert.hidden = true;
  }

  setFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.classList.add('input--invalid');
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  clearFieldError(input) {
    if (!input?.classList?.contains('input--invalid')) return;
    input.classList.remove('input--invalid');
    input.removeAttribute('aria-invalid');
  }

  clearAllErrors() {
    this.form.querySelectorAll('.input--invalid').forEach((el) => this.clearFieldError(el));
    this.hideMessage();
  }

  setLoading(loading, label = 'Aguarde...') {
    if (!this.#submitButton) return;
    this.#submitButton.disabled = loading;
    this.#submitButton.textContent = loading ? label : this.#submitLabel;
  }

  redirect(user, delay = 900) {
    const target = AuthConfig.REDIRECTS[user.papeis[0]] ?? '../index.html';
    setTimeout(() => { window.location.href = target; }, delay);
  }

  async #handleSubmit(event) {
    event.preventDefault();
    this.clearAllErrors();
    this.setLoading(true);

    try {
      await this.submit();
    } catch (error) {
      if (error instanceof AuthError) {
        this.showMessage(error.message, 'error');
        if (error.field) this.setFieldError(error.field);
      } else {
        console.error('[auth]', error);
        this.showMessage('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
      this.setLoading(false);
    }
  }
}

class ClienteRegisterForm extends AuthForm {
  async submit() {
    const result = await this.auth.registerCliente({
      nome: this.value('regName'),
      cpf: this.value('regCpf'),
      email: this.value('regMail'),
      senha: this.value('regPass'),
      consentimento: this.value('checkboxConsent')
    });

    this.form.reset();
    this.showMessage('Conta criada com sucesso! Redirecionando...', 'success');
    this.setLoading(true, 'Redirecionando...');
    this.redirect(result.user, 1200);
  }
}

class ParceiroRegisterForm extends AuthForm {
  constructor(form, auth) {
    super(form, auth);
    InputMask.attachPhone(document.getElementById('respTelefone'));
  }

  async submit() {
    const result = await this.auth.registerParceiro({
      nome: this.value('respNome'),
      cpf: this.value('respCpf'),
      email: this.value('respEmail'),
      telefone: this.value('respTelefone'),
      senha: this.value('password'),
      razaoSocial: this.value('razaoSocial'),
      cnpj: this.value('documento'),
      categoria: this.value('categoriaPrincipal')
    });

    this.form.reset();
    this.showMessage('Estabelecimento cadastrado! Redirecionando...', 'success');
    this.setLoading(true, 'Redirecionando...');
    this.redirect(result.user, 1200);
  }
}

class LoginForm extends AuthForm {
  #role;
  #fields;

  /**
   * @param {HTMLFormElement} form
   * @param {AuthService} auth
   * @param {string} role Papel exigido (cliente ou gestor_parceiro).
   * @param {{ email: string, password: string, remember: string }} fields ids dos campos.
   */
  constructor(form, auth, role, fields) {
    super(form, auth);
    this.#role = role;
    this.#fields = fields;
  }

  async submit() {
    const user = await this.auth.login({
      email: this.value(this.#fields.email),
      senha: this.value(this.#fields.password),
      remember: Boolean(this.value(this.#fields.remember)),
      role: this.#role,
      emailField: this.#fields.email,
      passField: this.#fields.password
    });

    this.showMessage(`Bem-vindo(a), ${user.nome.split(' ')[0]}! Redirecionando...`, 'success');
    this.setLoading(true, 'Entrando...');
    this.redirect(user);
  }
}

/* ==========================================================================
   Inicialização
   ========================================================================== */

class AuthApp {
  #auth;

  constructor(auth = new AuthService()) {
    this.#auth = auth;
  }

  get auth() {
    return this.#auth;
  }

  start() {
    const pages = [
      ['formCadastroCliente', (f) => new ClienteRegisterForm(f, this.#auth)],
      ['formEstabelecimento', (f) => new ParceiroRegisterForm(f, this.#auth)],
      ['formLoginCliente', (f) => new LoginForm(f, this.#auth, AuthConfig.ROLES.CLIENTE, {
        email: 'loginEmail', password: 'password', remember: 'lembrar'
      })],
      ['formLoginParceiro', (f) => new LoginForm(f, this.#auth, AuthConfig.ROLES.PARCEIRO, {
        email: 'loginPartnerEmail', password: 'partnerPassword', remember: 'lembrarParceiro'
      })]
    ];

    pages.forEach(([id, create]) => {
      const form = document.getElementById(id);
      if (form) create(form);
    });
  }
}

if (typeof window !== 'undefined') {
  window.AuthConfig = AuthConfig;
  window.AuthError = AuthError;
  window.Validator = Validator;
  window.InputMask = InputMask;
  window.PasswordHasher = PasswordHasher;
  window.User = User;
  window.Cliente = Cliente;
  window.Parceiro = Parceiro;
  window.Estabelecimento = Estabelecimento;
  window.LocalStorageDB = LocalStorageDB;
  window.Database = Database;
  window.SessionManager = SessionManager;
  window.AuthService = AuthService;
  window.AuthForm = AuthForm;
  window.ClienteRegisterForm = ClienteRegisterForm;
  window.ParceiroRegisterForm = ParceiroRegisterForm;
  window.LoginForm = LoginForm;
  window.AuthApp = AuthApp;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.vittaAuth = new AuthApp();
    window.vittaAuth.start();
  });
}
