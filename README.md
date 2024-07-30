# Api Rest de Autenticação JWT com sistema CRUD construído em Node.js, Express e MongoDB Atlas.

Api Rest Node.js e Express com autenticação de usuário utilizando JWT(Json Web Token), Nodemailer para recuperação de senha, MongoDB Atlas para serviços de armazenamento de dados na nuvem e um sistema CRUD para cadastro, leitura, atualização e exclusão de projetos e suas tarefas.

## Configurações Iniciais

Antes de tudo, é preciso saber. Em **Instalação**, logo após clonar o repositório, é preciso configurar a estrutura do arquivo **mail.json** com as credenciais **SMTP** do seu provedor de email. O arquivo está localizado na pasta **config**. No projeto foi utilizado a ferramenta [Mailtrap](https://mailtrap.io/) para testar o envio de email.

```
{
  "host": "smtp.domain.io",
  "port": 2525,
  "secure": false,
  "user": "username@domain.com",
  "pass": "password"
}
```

```

```

## Instalação

Instale o **nodemon** globalmente

```
npm install -g nodemon
```

Fazer o clone do repositório

```
git clone https://github.com/rodrigo93sj/node-rest-api
```

Instalar os pacotes

```
npm install 
```

Rodar o servidor

```
yarn start
```

## Testando API

Utilize o [Insomnia](https://insomnia.rest/) para testar a API, ou algum de sua preferência.

#### Criando usuário

Para criar um usuário, crie e utilize a rota ```http://localhost:4000/register``` com método **POST**, especificando **name**, **email** e **password**. Por padrão, **isAdmin** vem como false. Caso queira alterá-la para true, adicione **isAdmin: true** no corpo da requisição.

```
{
	"name": "test",
	"email": "test@gmail.com",
	"password": "test123456"
}
```

#### Autenticando usuário

Para autenticar usuário, crie e utilize a rota ```http://localhost:4000/auth``` com método **POST**, especificando **email** e **password**. 

```
{
	"email": "test@gmail.com",
	"password": "test123456"
}
```

#### Token de acesso

Após autenticar usuário, é gerado um token. Copie o token e cole no **Header** das requisições que precisam da autenticação do usuário. Criar rota ```http://localhost:4000/user``` com método **GET**. Adicionar uma nova **Header** na requisição ```Authorization``` e um valor ```Bearer token_de_acesso_do_usuario```.

#### Esqueci a Senha

Para trocar de senha, um email é enviado ao usuário com **token** para ser adicionado a requisição **reset_password**. Crie e utilize a rota ```http://localhost:4000/auth/forgot_password``` com método **POST** para enviar o token ao email do usuário. Copie o token.

```
{
	"email": "test@gmail.com"
}
```

Crie e utilize a rota ```http://localhost:4000/auth/reset_password``` com método **POST** para trocar a senha do usuário. Cole o token no corpo da requisição.

```
{
	"email": "rodrigoengj@gmail.com",
	"token": "e08e7172c1c439f74721920cb8ea702924a6c283",
	"password": "hudson19937416"
}
```

## Acessando Rotas Protegidas

Para acessar rotas protegidas é preciso copiar o token de autenticação do usuário e colar na **Header** de cada requisição. Nova header ```Authorization``` e novo valor ```Bearer token_de_acesso_do_usuario```.

#### Criando projeto

Crie e utilize a rota ```http://localhost:4000/projects``` com método **POST**, para criar os projetos e suas tarefas.
```
{
	"title": "Projeto 1",
	"description": "Descrição do projeto",
	"tasks": [
		{
			"title": "Tarefa 1"
		},
		{
			"title": "Tarefa 2"
		}
	]
}
```

#### Listando projetos

Crie e utilize a rota ```http://localhost:4000/projects``` com método **GET**, para listar os projetos.

#### Atualizando projeto

Crie e utilize a rota ```http://localhost:4000/projects/projectId``` com método **PUT**. Será necessário copiar o id de um projeto e substituir em **projectId**.

```
{
	"title": "Projeto Atualizado",
	"description": "Descrição do projeto atualizado",
	"tasks": [
		{
			"title": "Tarefa atualizada"
		}
	]
}
```

#### Deletando projeto

Crie e utilize a rota ```http://localhost:4000/projects/projectId``` com método **DELETE**. Será necessário copiar o id de um projeto e substituir em **projectId**.

#### Listando um único projeto

Crie e utilize a rota ```http://localhost:4000/projects/projectId``` com método **GET**. Será necessário copiar o id de um projeto e substituir em **projectId**.

## Licença

[Mit](http://escolhaumalicenca.com.br/licencas/mit/)