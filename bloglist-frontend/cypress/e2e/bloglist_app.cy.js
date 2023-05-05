describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test McTesy',
      username: 'test12',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    const user2 = {
      name: '123TEST',
      username: '123TEST',
      password: 'testtest',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login')
    cy.contains('blogs')
  })

  describe('login', function () {
    it('user can login with correct username.password', function () {
      cy.get('#username').type('test12')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()

      cy.contains('Test McTesy logged in')
    })

    it('login fails with incorrect username/password', function () {
      cy.get('#username').type('test12')
      cy.get('#password').type('wrong')
      cy.get('#login-btn').click()

      cy.get('.error').contains('Wrong username or password')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('test12')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()

      cy.contains('add blog entry').click()
    })

    it('A blog can be created', function () {
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Dwayne the Rock Johnson')
      cy.get('#url').type('www.omg.net')
      cy.contains('create').click()

      cy.contains('a blog created by cypress')
    })

    it('user can like blog', function () {
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Dwayne the Rock Johnson')
      cy.get('#url').type('www.omg.net')
      cy.contains('create').click()

      cy.contains('a blog created by cypress')

      cy.contains('view').click()
      cy.get('#like').click()

      cy.contains('1')
    })
    it('user can delete own blog', function () {
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Dwayne the Rock Johnson')
      cy.get('#url').type('www.omg.net')
      cy.contains('create').click()

      cy.contains('a blog created by cypress')

      cy.contains('view').click()
      cy.contains('Delete').click()

      cy.contains('www.omg.net').should('not.exist')
    })
  })

  describe('different user is logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('test12')
      cy.get('#password').type('password')
      cy.get('#login-btn').click()

      cy.contains('Test McTesy logged in')
      cy.contains('add blog entry').click()

      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('Dwayne the Rock Johnson')
      cy.get('#url').type('www.omg.net')
      cy.contains('create').click()

      cy.get('#log-out').click()
    })
    it('user cannot see delete button if they didnt create blog', function () {
      cy.get('#username').type('123TEST')
      cy.get('#password').type('testtest')
      cy.get('#login-btn').click()

      cy.contains('a blog created by cypress')
      cy.contains('view').click()

      cy.contains('delete').should('not.exist')
    })
  })
  describe('liking blogs', function () {
    beforeEach(function () {
      cy.login({ username: 'test12', password: 'password' })

      cy.createBlog({
        title: 'a blog created by cypress',
        author: 'Dwayne the Rock Johnson',
        url: 'www.omg.net',
      })
      cy.createBlog({
        title: 'a better blog',
        author: 'Kevin Hart',
        url: 'www.tooshort.org',
      })
      cy.createBlog({
        title: 'a worse blog',
        author: 'cypress',
        url: 'https://www.test.com/',
      })
    })

    it.only('highest liked blog is at top', async function () {
      cy.contains('a better blog').contains('view').click()

      cy.contains('a better blog').parent().contains('like').as('theButton')
      cy.get('@theButton').click().wait(500).click().wait(500)
      cy.contains('a better blog').parent().contains('hide').click()

      cy.contains('a blog created by cypress').contains('view').click()

      cy.contains('a blog created by cypress').parent().contains('like').as('secondButton')
      cy.get('@secondButton').click().wait(500)
      cy.contains('a blog created by cypress').parent().contains('hide').click()

      cy.reload()

      cy.get('.blog').eq(0).should('contain', 'a better blog')
      cy.get('.blog').eq(1).should('contain', 'a blog created by cypress')
      cy.get('.blog').eq(2).should('contain', 'a worse blog')
    })
  })
})
