role :app, %w(hosting_dima1212@cobalt.locum.ru)
role :web, %w(hosting_dima1212@cobalt.locum.ru)
role :db, %w(hosting_dima1212@cobalt.locum.ru)

set :ssh_options, forward_agent: true, port: 220
set :rails_env, :production
