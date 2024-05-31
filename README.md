
# Open source Kahoot alternative

This is an open source Kahoot alternative , a game-based learning platform that brings engagement and fun at school, work, and at home.
This project aims to provide similar functionality to Kahoot while being customizable and extensible for various educational and entertainment purposes.


1. The host starts the game
1. Players join the game
1. The host starts the questions
1. Players answer the questions
1. Results are shown


##  Built With
* [Nextjs](https://nextjs.org/)
* [Supabase](https://supabase.com/)
* [Tailwind CSS](https://tailwindcss.com/)


## Run Locally
```sh
# Install dependencies 

npm install

# Start Supabase

supabase start

# Start Next.js locally

npm run dev

# Access app in your web browser at `http://localhost:3000`. 

```

Access the project root at / to join as a player.

Access /host to join as a host.

## Generate Types

`supabase gen types typescript --local --schema public > src/types/supabase.ts`

[read more on generating types](https://supabase.com/docs/guides/api/rest/generating-types)


## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these guidelines:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)

