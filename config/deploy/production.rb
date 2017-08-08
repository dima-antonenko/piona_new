role :app, %w{cobalt.locum.ru}
role :web, %w{cobalt.locum.ru}
role :db,  %w{cobalt.locum.ru}
 
set :ssh_options, {
  user: fetch(:user),
  forward_agent: true,
  auth_methods: %w(password),
  password: 'I1TnrbOUwwS'
}