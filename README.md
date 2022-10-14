#### Case Fullstack Shopper

Documentação API: https://documenter.getpostman.com/view/21551909/2s83zfRR5q

Surge do frontEnd: https://case-shopper-frontend.surge.sh

**Sobre o projeto**

Front-end realizado utilizando ReactJS e estilizado com styled-components/frameworks como ChakraUI e bootstrap.

Back-end realizado utilizando NodeJS, Typescript, Express, Knex, Uuid, JWT, Bcryptjs, e realizado testes unitários (jest) com 90% de cobertura.

Banco de dados feito com mySQL.

**Funcionalidades**

- **Cadastro**

O usuário pode se cadastrar informando um nome, email, senha. Não é possível criar dois usuários com o mesmo email. (Por fins didáticos qualquer usuário é capaz de se cadastrar, em um cenário real somente com um login de administrador poderia ser criado um novo cadastro para um funcionário.)

- **Login**

Basta informar o email e a senha corretamente que o usuário poderá logar na aplicação. Os endpoints de login e cadastro retornam **um** **token** que é utilizado para autenticação dos próximos endpoints.

- **Visualizar todos os produtos disponíveis**

Retorna todos os produtos disponíveis do mercado e suas informações, como números no estoque e preço por unidade.

- **Cadastrar um novo pedido** 

A partir do token de autenticação fornecido no login, o usuário é capaz de cadastrar um pedido, informando o nome do cliente, data da entrega e um array com os produtos. Através do token também é passado o nome do usuário para ser armazenado no banco de dados, assim todo pedido registrado terá o nome de quem o registrou (o funcionário, no caso).

- **Visualizar todos os pedidos registrados **

A partir do token de autenticação fornecido no login, um usuário pode acessar um histórico contendo todos os pedidos registrados, possuindo acesso ao nome de quem registrou, o nome do cliente, a data de entrega e o preço total.

- **Visualizar todos os produtos de um pedido**

A partir do token de autenticação fornecido no login, um usuário pode acessar quais produtos foram registrados em determinado pedido.

* **Deletar um produto de um pedido**

A partir do token de autenticação fornecido no login, um usuário pode excluir um produto especifico dentro de um pedido já registrado, a quantidade deste produto será adicionada ao estoque.

* **Deletar um pedido**

A partir do token de autenticação fornecido no login, um usuário pode excluir um pedido inteiro e todos seus produtos com suas respectivas quantidades serão adicionados ao estoque.

