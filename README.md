# Como iniciar o projeto

## Configuração das variáveis de ambiente

Copie o arquivo .env.example e crie um novo arquivo .env na raiz do projeto. O docker-compose usará automaticamente essas variáveis.

Comando:
```
cp .env.example .env
```

## Executando o projeto

Certifique-se de ter o Docker Compose instalado. Depois, execute o comando abaixo para iniciar toda a aplicação:

```
docker-compose up -d
```

Esse comando irá subir todos os containers necessários. Após isso, você poderá acessar a aplicação em http://localhost:9000

O projeto foi desenvolvido em monorepo unido por um Nginx

## Documentação da API

Para acessar a documentação da API (Swagger), acesse o endpoint:

http://localhost:9000/docs/

## Executando os testes

Para rodar os testes automatizados, utilize o comando:

npm run test