# 📋 Task Manager Fullstack

Sistema completo de gerenciamento de tarefas com autenticação e permissões (admin/usuário), desenvolvido como desafio técnico.

---

## ⚙️ Tecnologias utilizadas

- **Frontend**: Next.js (TypeScript)
- **Backend**: NestJS (TypeScript)
- **Banco de dados**: PostgreSQL
- **Infraestrutura**: Docker (com `docker-compose`)
- **Auth**: JWT com controle de níveis (`admin`, `user`)

---

## 🚀 Como rodar o projeto localmente

> Requisitos:
> - Docker e Docker Compose instalados
> - Porta `3000` e `3001` livres (ou configure manualmente)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
```

### 2. Suba os containers

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend + Swagger: http://localhost:3001/api  
- PostgreSQL: porta 5432

> O projeto pode demorar alguns segundos no primeiro build.

---

## 🥚 Testando a aplicação

### Acesso ao Swagger:

```url
http://localhost:3001/api
```

Use o botão **Authorize** (🔒) para testar rotas protegidas com o JWT.

---

## 👤 Usuário Admin

Um usuário administrador é criado automaticamente na primeira inicialização:

| Campo     | Valor             |
|-----------|-------------------|
| **Email** | `admin@admin.com` |
| **Senha** | `admin123`        |

Com esse usuário você pode:

- Listar todos os usuários
- Visualizar tarefas de qualquer usuário

---

## 📂 Estrutura de diretórios

```
.
├── backend
│   └── src
│       ├── auth
│       ├── users
│       ├── tasks
│       └── main.ts
├── frontend
│   └── app
│       ├── login
│       ├── cadastro
│       ├── tarefas
│       └── admin
└── docker-compose.yml
```

---

## 🔐 Autenticação

Após login ou cadastro, um token JWT é salvo no `localStorage`.

```json
{
  "access_token": "JWT..."
}
```

Esse token é enviado automaticamente em todas as requisições ao backend.

---

## 📦 Variáveis de ambiente

Você pode personalizar no `docker-compose.yml`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=taskdb
JWT_SECRET=sua_chave_super_segura
```

---

## 🧼 Observações finais

- Nunca utilize `synchronize: true` em produção.
- A senha dos usuários é armazenada com **bcrypt**.
- Para resetar tudo, use:

```bash
docker-compose down --volumes
```

---

## 📬 Contato

Desenvolvido com 💻 por Daniel Pellicano.