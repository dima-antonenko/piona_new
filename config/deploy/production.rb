role :app, %w{cobalt.locum.ru:220}
role :web, %w{cobalt.locum.ru:220}
role :db,  %w{cobalt.locum.ru:220}
 
set :ssh_options, {
  user: fetch(:user),
  forward_agent: true,
  auth_methods: %w(password),
  password: 'I1TnrbOUwwS'
}

#server "cobalt.locum.ru", user: "hosting_dima1212", roles: %w{web app db}, port: 220