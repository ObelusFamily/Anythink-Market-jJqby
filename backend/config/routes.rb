
Rails.application.routes.draw do
  root to: "application#root"

  scope :api, defaults: { format: :json } do
    devise_for :users, controllers: { sessions: :sessions },
                       path_names: { sign_in: :login }

    resource :user, only: %i[show update]

    resources :profiles, param: :username, only: [:show] do
      resource :follow, only: %i[create destroy]
    end

    resources :items, param: :slug,
      constraints: { slug: /[A-Za-z0-9_.]+./ },
      except: %i[edit new] do
      resource :favorite, only: %i[create destroy]
      resources :comments, only: %i[create index destroy]
      get :feed, on: :collection
    end

    resources :tags, only: [:index]

    resources :ping, only: [:index]
  end
end
