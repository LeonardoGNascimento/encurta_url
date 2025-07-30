# Como iniciar o projeto

## Configuração das variáveis de ambiente

Para configurar as variáveis de ambiente, basta copiar o arquivo .env.example e renomeá-lo para .env na raiz do projeto.

Não é necessário alterar as variáveis nesse arquivo, pois o docker-compose já está preparado para usá-las como estão.

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

```
npm run test
```

## Exemplo de uso

Para facilitar os testes das funcionalidades desta API, foi criado um front-end utilizando a IA da Lovable.

Você pode acessá-lo pelo seguinte link:

https://shorturl.legana.com.br/