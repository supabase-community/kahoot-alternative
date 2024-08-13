-- insert english quiz for GA week
insert into public.quiz_sets
    (id, name, description)
    values ('bb2ddb95-f632-48bd-a042-eb07b3f7ef8d', 'GA Week Supabase Meetup Quiz', 'A quiz for the Supabase Meetup');


select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'What was the original name of the programming language JavaScript?'::text,
    "order" => 0,
    choices => array[
      '{"body": "Mocha", "is_correct": true}'::json,
      '{"body": "LiveScript", "is_correct": false}'::json,
      '{"body": "ECMAScript", "is_correct": false}'::json,
      '{"body": "JScript", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'What does the acronym “API” stand for in the context of software development?'::text,
    "order" => 1,
    choices => array[
      '{"body": "Application Programming Interface", "is_correct": true}'::json,
      '{"body": "Automated Programming Instructions", "is_correct": false}'::json,
      '{"body": "Advanced Program Integration", "is_correct": false}'::json,
      '{"body": "Algorithmic Programming Interface", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'How many GitHub stars does the main supabase repo have?'::text,
    "order" => 2,
    choices => array[
      '{"body": "45k", "is_correct": false}'::json,
      '{"body": "55k", "is_correct": false}'::json,
      '{"body": "65k", "is_correct": true}'::json,
      '{"body": "75k", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'According to the Stack Overflow Survey 2022 what is the most popular database language amongst respondents?'::text,
    "order" => 3,
    choices => array[
      '{"body": "PostgreSQL", "is_correct": true}'::json,
      '{"body": "MySQL", "is_correct": false}'::json,
      '{"body": "Microsoft SQL Server", "is_correct": false}'::json,
      '{"body": "Excel", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'How many lines of code are there in Windows 10?'::text,
    "order" => 4,
    choices => array[
      '{"body": "500,000", "is_correct": false}'::json,
      '{"body": "5 million", "is_correct": false}'::json,
      '{"body": "50 million", "is_correct": true}'::json,
      '{"body": "500 million", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'What year was TypeScript released to the public?'::text,
    "order" => 5,
    choices => array[
      '{"body": "2001", "is_correct": false}'::json,
      '{"body": "2009", "is_correct": false}'::json,
      '{"body": "2012", "is_correct": true}'::json,
      '{"body": "2018", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'Which Supabase client library has the most usage across all projects?'::text,
    "order" => 6,
    choices => array[
      '{"body": "Python", "is_correct": false}'::json,
      '{"body": "Flutter", "is_correct": false}'::json,
      '{"body": "Javascript", "is_correct": true}'::json,
      '{"body": "SSR", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'Where is the company that builds the Opera Browser headquartered?'::text,
    "order" => 7,
    choices => array[
      '{"body": "Denmark", "is_correct": false}'::json,
      '{"body": "Norway", "is_correct": true}'::json,
      '{"body": "Singapore", "is_correct": false}'::json,
      '{"body": "Kenya", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'Who is the original author of React?'::text,
    "order" => 8,
    choices => array[
      '{"body": "Steve Jobs", "is_correct": false}'::json,
      '{"body": "Jordan Walke", "is_correct": true}'::json,
      '{"body": "Dan Abramov", "is_correct": false}'::json,
      '{"body": "Guido van Rossum", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'::uuid,
    body => 'In ASCII what is the binary representation of an upper case W?'::text,
    "order" => 9,
    choices => array[
      '{"body": "01010111", "is_correct": true}'::json,
      '{"body": "11010111", "is_correct": false}'::json,
      '{"body": "01000111", "is_correct": false}'::json,
      '{"body": "01010101", "is_correct": false}'::json
    ]
  );


-- insert Spanish quiz for GA week
insert into public.quiz_sets
    (id, name, description)
    values ('9a525135-cd91-4372-9171-02fc57c6713a', 'GA Week Supabase Meetup Quiz Español', 'Un cuestionario para el Supabase Meetup');


select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Cuál es el nombre original de JavaScript? '::text,
    "order" => 0,
    choices => array[
      '{"body": "Mocha", "is_correct": true}'::json,
      '{"body": "LiveScript", "is_correct": false}'::json,
      '{"body": "ECMAScript", "is_correct": false}'::json,
      '{"body": "JScript", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Qué significa API en el contexto de desarrollo de software? '::text,
    "order" => 1,
    choices => array[
      '{"body": "Application Programming Interface", "is_correct": true}'::json,
      '{"body": "Automated Programming Instructions", "is_correct": false}'::json,
      '{"body": "Advanced Program Integration", "is_correct": false}'::json,
      '{"body": "Algorithmic Programming Interface", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Cuántas estrellas tiene el repositorio principal de Supabase? '::text,
    "order" => 2,
    choices => array[
      '{"body": "45k", "is_correct": false}'::json,
      '{"body": "55k", "is_correct": false}'::json,
      '{"body": "65k", "is_correct": true}'::json,
      '{"body": "75k", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Cuál es el lenguaje más popular para bases de datos según la encuesta de Stack Overflow del 2023? '::text,
    "order" => 3,
    choices => array[
      '{"body": "PostgreSQL", "is_correct": true}'::json,
      '{"body": "MySQL", "is_correct": false}'::json,
      '{"body": "Microsoft SQL Server", "is_correct": false}'::json,
      '{"body": "Excel", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Cuántas líneas de código hay en total en Windows 10?'::text,
    "order" => 4,
    choices => array[
      '{"body": "500,000", "is_correct": false}'::json,
      '{"body": "5 millones", "is_correct": false}'::json,
      '{"body": "50 millones", "is_correct": true}'::json,
      '{"body": "500 millones", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿En qué año fue publicado TypeScript? '::text,
    "order" => 5,
    choices => array[
      '{"body": "2001", "is_correct": false}'::json,
      '{"body": "2009", "is_correct": false}'::json,
      '{"body": "2012", "is_correct": true}'::json,
      '{"body": "2018", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Cuál libreria de clientes (client library) de Supabase se utiliza más?'::text,
    "order" => 6,
    choices => array[
      '{"body": "Python", "is_correct": false}'::json,
      '{"body": "Flutter", "is_correct": false}'::json,
      '{"body": "Javascript", "is_correct": true}'::json,
      '{"body": "SSR", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Dónde se encuentra la oficina principal de Opera Browser?'::text,
    "order" => 7,
    choices => array[
      '{"body": "Dinamarca", "is_correct": false}'::json,
      '{"body": "Noruega", "is_correct": true}'::json,
      '{"body": "Singapur", "is_correct": false}'::json,
      '{"body": "Kenia", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => '¿Quién es el autor original de React?'::text,
    "order" => 8,
    choices => array[
      '{"body": "Steve Jobs", "is_correct": false}'::json,
      '{"body": "Jordan Walke", "is_correct": true}'::json,
      '{"body": "Dan Abramov", "is_correct": false}'::json,
      '{"body": "Guido van Rossum", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '9a525135-cd91-4372-9171-02fc57c6713a'::uuid,
    body => 'En código ASCII ¿Cuál es la representación binaria de la letra W mayúscula? '::text,
    "order" => 9,
    choices => array[
      '{"body": "01010111", "is_correct": true}'::json,
      '{"body": "11010111", "is_correct": false}'::json,
      '{"body": "01000111", "is_correct": false}'::json,
      '{"body": "01010101", "is_correct": false}'::json
    ]
  );


-- insert Japanese quiz for GA week
insert into public.quiz_sets
    (id, name, description)
    values ('ac8483a1-fb60-4d65-b898-58f830bbabdd', 'GA Week Supabase Meetup Quiz 日本語', 'A quiz for the Supabase Meetup in Japanese');


select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'プログラミング言語JavaScriptが最初作られた時の名前は？'::text,
    "order" => 0,
    choices => array[
      '{"body": "Mocha", "is_correct": true}'::json,
      '{"body": "LiveScript", "is_correct": false}'::json,
      '{"body": "ECMAScript", "is_correct": false}'::json,
      '{"body": "JScript", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => '「API」は何の略？'::text,
    "order" => 1,
    choices => array[
      '{"body": "Application Programming Interface", "is_correct": true}'::json,
      '{"body": "Automated Programming Instructions", "is_correct": false}'::json,
      '{"body": "Advanced Program Integration", "is_correct": false}'::json,
      '{"body": "Algorithmic Programming Interface", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => '今現在SupabaseのメインGitHubレポジトリーには何個スターがついている？'::text,
    "order" => 2,
    choices => array[
      '{"body": "45k", "is_correct": false}'::json,
      '{"body": "55k", "is_correct": false}'::json,
      '{"body": "65k", "is_correct": true}'::json,
      '{"body": "75k", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => '2023年のStack Overflowアンケートで一番人気なデータベースは何？'::text,
    "order" => 3,
    choices => array[
      '{"body": "PostgreSQL", "is_correct": true}'::json,
      '{"body": "MySQL", "is_correct": false}'::json,
      '{"body": "Microsoft SQL Server", "is_correct": false}'::json,
      '{"body": "Excel", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'Windows 10のソースコードは何行？'::text,
    "order" => 4,
    choices => array[
      '{"body": "50万行", "is_correct": false}'::json,
      '{"body": "500万行", "is_correct": false}'::json,
      '{"body": "5,000万行", "is_correct": true}'::json,
      '{"body": "5億行", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'TypeScriptがリリースされたのは何年？'::text,
    "order" => 5,
    choices => array[
      '{"body": "2001年", "is_correct": false}'::json,
      '{"body": "2009年", "is_correct": false}'::json,
      '{"body": "2012年", "is_correct": true}'::json,
      '{"body": "2018年", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => '一番使われているSupabaseのクライアントライブラリーはどれ？'::text,
    "order" => 6,
    choices => array[
      '{"body": "Python", "is_correct": false}'::json,
      '{"body": "Flutter", "is_correct": false}'::json,
      '{"body": "Javascript", "is_correct": true}'::json,
      '{"body": "SSR", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'Operaブラウザを作っている会社の本社があるのはどこ？'::text,
    "order" => 7,
    choices => array[
      '{"body": "デンマーク", "is_correct": false}'::json,
      '{"body": "ノルウェー", "is_correct": true}'::json,
      '{"body": "シンガポール", "is_correct": false}'::json,
      '{"body": "ケニア", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'Reactを最初に作ったのは誰？'::text,
    "order" => 8,
    choices => array[
      '{"body": "Steve Jobs", "is_correct": false}'::json,
      '{"body": "Jordan Walke", "is_correct": true}'::json,
      '{"body": "Dan Abramov", "is_correct": false}'::json,
      '{"body": "Guido van Rossum", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => 'ac8483a1-fb60-4d65-b898-58f830bbabdd'::uuid,
    body => 'ASCIIで、大文字のWを2進数で正しく表しているのはどれ？'::text,
    "order" => 9,
    choices => array[
      '{"body": "01010111", "is_correct": true}'::json,
      '{"body": "11010111", "is_correct": false}'::json,
      '{"body": "01000111", "is_correct": false}'::json,
      '{"body": "01010101", "is_correct": false}'::json
    ]
  );

-- insert Portuguese quiz for GA week
insert into public.quiz_sets
    (id, name, description)
    values ('0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab', 'Supabase Meetup Quiz Português', 'A quiz for the Supabase Meetup in Português');


select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Qual é o nome original de JavaScript?'::text,
    "order" => 0,
    choices => array[
      '{"body": "Mocha", "is_correct": true}'::json,
      '{"body": "LiveScript", "is_correct": false}'::json,
      '{"body": "ECMAScript", "is_correct": false}'::json,
      '{"body": "JScript", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Qual o sigificado da sigla API?'::text,
    "order" => 1,
    choices => array[
      '{"body": "Application Programming Interface", "is_correct": true}'::json,
      '{"body": "Automated Programming Instructions", "is_correct": false}'::json,
      '{"body": "Advanced Program Integration", "is_correct": false}'::json,
      '{"body": "Algorithmic Programming Interface", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Quantas estrelas tem o repositório da Supabase?'::text,
    "order" => 2,
    choices => array[
      '{"body": "45k", "is_correct": false}'::json,
      '{"body": "55k", "is_correct": false}'::json,
      '{"body": "65k", "is_correct": true}'::json,
      '{"body": "75k", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'De acordo com a pesquisa do Stack Overflow em 2023 qual é o banco de dados mais popular?'::text,
    "order" => 3,
    choices => array[
      '{"body": "PostgreSQL", "is_correct": true}'::json,
      '{"body": "MySQL", "is_correct": false}'::json,
      '{"body": "Microsoft SQL Server", "is_correct": false}'::json,
      '{"body": "Excel", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Quantas linhas de código existe no Windows 10?'::text,
    "order" => 4,
    choices => array[
      '{"body": "500,000", "is_correct": false}'::json,
      '{"body": "5 million", "is_correct": false}'::json,
      '{"body": "50 million", "is_correct": true}'::json,
      '{"body": "500 million", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Em que ano foi publicado TypeScript? '::text,
    "order" => 5,
    choices => array[
      '{"body": "2001", "is_correct": false}'::json,
      '{"body": "2009", "is_correct": false}'::json,
      '{"body": "2012", "is_correct": true}'::json,
      '{"body": "2018", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Qual é a biblioteca mais usada de Supabase entre todos os projetos?'::text,
    "order" => 6,
    choices => array[
      '{"body": "Python", "is_correct": false}'::json,
      '{"body": "Flutter", "is_correct": false}'::json,
      '{"body": "Javascript", "is_correct": true}'::json,
      '{"body": "SSR", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Onde está escritório principal do Opera Browser?'::text,
    "order" => 7,
    choices => array[
      '{"body": "Dinamarca", "is_correct": false}'::json,
      '{"body": "Noruega", "is_correct": true}'::json,
      '{"body": "Singapura", "is_correct": false}'::json,
      '{"body": "Quénia", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => '¿Quem é o autor original do framework React? '::text,
    "order" => 8,
    choices => array[
      '{"body": "Steve Jobs", "is_correct": false}'::json,
      '{"body": "Jordan Walke", "is_correct": true}'::json,
      '{"body": "Dan Abramov", "is_correct": false}'::json,
      '{"body": "Guido van Rossum", "is_correct": false}'::json
    ]
  );
select
  add_question (
    quiz_set_id => '0c9f0d6d-7659-4f2d-a258-cafe6b74c9ab'::uuid,
    body => 'Em código ASCII, como é a representação binária da letra W maiuscula?'::text,
    "order" => 9,
    choices => array[
      '{"body": "01010111", "is_correct": true}'::json,
      '{"body": "11010111", "is_correct": false}'::json,
      '{"body": "01000111", "is_correct": false}'::json,
      '{"body": "01010101", "is_correct": false}'::json
    ]
  );

-- Insert LW12 quiz
insert into public.quiz_sets
    (id, name, description)
    values ('ae53ca2c-c7f4-4b31-8b71-51fab618a74f', 'LW12 Meetup Quiz', 'A quiz for the LW12 Supabase Meetup');


select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'What was the launch on day 1 of LW12?'::text,
    "order" => 0,
    choices => array[
      '{"body": "VS Code extension", "is_correct": true}'::json,
      '{"body": "Supabase goes GA", "is_correct": false}'::json,
      '{"body": "postgres.new", "is_correct": true}'::json,
      '{"body": "anonymous sign-in", "is_correct": false}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'How many GitHub stars does the main supabase repo have?'::text,
    "order" => 1,
    choices => array[
      '{"body": "40k", "is_correct": false}'::json,
      '{"body": "50k", "is_correct": false}'::json,
      '{"body": "60k", "is_correct": false}'::json,
      '{"body": "70k", "is_correct": true}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'According to the 2023 Stack Overflow developer survey, what is the most popular database?'::text,
    "order" => 2,
    choices => array[
      '{"body": "MySQL", "is_correct": false}'::json,
      '{"body": "Postgres", "is_correct": true}'::json,
      '{"body": "Excel", "is_correct": false}'::json,
      '{"body": "Microsoft SQL Server", "is_correct": false}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'Which product was the first product offered by Supabase?'::text,
    "order" => 3,
    choices => array[
      '{"body": "Auto generated APIs", "is_correct": false}'::json,
      '{"body": "Realtime", "is_correct": true}'::json,
      '{"body": "Auth", "is_correct": false}'::json,
      '{"body": "Storage", "is_correct": false}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'Which of the following client libraries is currently maintained by the community?'::text,
    "order" => 4,
    choices => array[
      '{"body": "JavaScript", "is_correct": false}'::json,
      '{"body": "Flutter(Dart)", "is_correct": false}'::json,
      '{"body": "Swift", "is_correct": false}'::json,
      '{"body": "Kotlin", "is_correct": true}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'How many different locations is the Supabase LW12 meetup being held at?'::text,
    "order" => 5,
    choices => array[
      '{"body": "10 - 20", "is_correct": false}'::json,
      '{"body": "20 - 30", "is_correct": false}'::json,
      '{"body": "30 - 40", "is_correct": false}'::json,
      '{"body": "Over 40", "is_correct": true}'::json
    ]
  );

select
  add_question (
    quiz_set_id => 'ae53ca2c-c7f4-4b31-8b71-51fab618a74f'::uuid,
    body => 'What might you win when you create your LW12 ticket and share it on socials?'::text,
    "order" => 6,
    choices => array[
      '{"body": "Supabase World Tour T-Shirt", "is_correct": true}'::json,
      '{"body": "Mechanical Keyboard", "is_correct": false}'::json,
      '{"body": "Supabase iPhone case", "is_correct": false}'::json,
      '{"body": "Wandrd Backpack", "is_correct": true}'::json
    ]
  );
