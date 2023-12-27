# [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository

## Installations

```bash
npm install
```

## Run with docker

```bash
cp .env.example .env
docker compose up -d
```

View APIs docs at <http://localhost:3000/docs>
View Adminer at <http://localhost:8081>

## Re-build docker image after install new package

```bash
docker compose build api
```

## Test

```bash
# unit tests
$ npm run test:unit

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).