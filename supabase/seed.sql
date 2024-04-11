insert into public.quiz_sets
    (id, name, description)
    values ('bb2ddb95-f632-48bd-a042-eb07b3f7ef8d', 'Supabase Meetup Quiz', 'A quiz for the Supabase Meetup');

insert into public.questions 
    (id, body, "order", quiz_set_id) 
    values ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'What was the original name of the programming language JavaScript?', 0, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('7118f778-6fee-44b9-9bae-57c4a6623cee', 'What does the acronym “API” stand for in the context of software development? ', 1, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('a08cb669-559b-402b-8a30-95fbe947f355', 'How many GitHub stars does the main supabase repo have? ', 2, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('de14560b-55f9-4177-9871-656cc94af2a6', 'According to the Stack Overflow Survey 2022 what is the most popular database language amongst respondents?', 3, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('c02de51d-d10a-4a49-87a4-43be5ebf6d2e', 'How many lines of code are there in Windows 10?', 4, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('40aeace0-7210-42cd-aa12-e274857b5a0b', 'What year was TypeScript released to the public?', 5, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('7f3d9327-885c-4f15-b897-ed3a31c31baf', 'Which Supabase client library has the most usage across all projects? ', 6, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('290ecdc8-aab0-490d-a894-06df33b7e92e', 'Where is the company that builds the Opera Browser headquartered?', 7, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('a7a50c71-0ecb-4002-a527-a82724b37bc5', 'Who is the original author of React?', 8, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d'),
           ('d8aba5d7-8b14-449e-a610-2455521d7ee1', 'In ASCII what is the binary representation of an upper case W?', 9, 'bb2ddb95-f632-48bd-a042-eb07b3f7ef8d');

insert into public.choices
    (question_id, body, is_correct)
    values ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'Mocha', true),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'LiveScript', false),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'ECMAScript', false),
           ('14fb0db9-648e-42a4-a7d9-dc3ad7a13e2e', 'JScript', false),

           ('7118f778-6fee-44b9-9bae-57c4a6623cee', 'Application Programming Interface', false),
           ('7118f778-6fee-44b9-9bae-57c4a6623cee', 'Automated Programming Instructions', false),
           ('7118f778-6fee-44b9-9bae-57c4a6623cee', 'Advanced Program Integration', false),
           ('7118f778-6fee-44b9-9bae-57c4a6623cee', 'Algorithmic Programming Interface', true),

           ('a08cb669-559b-402b-8a30-95fbe947f355', '45k', false),
           ('a08cb669-559b-402b-8a30-95fbe947f355', '55K', false),
           ('a08cb669-559b-402b-8a30-95fbe947f355', '65K', true),
           ('a08cb669-559b-402b-8a30-95fbe947f355', '75K', false),

           ('de14560b-55f9-4177-9871-656cc94af2a6', 'PostgreSQL', true),
           ('de14560b-55f9-4177-9871-656cc94af2a6', 'MySQL', false),
           ('de14560b-55f9-4177-9871-656cc94af2a6', 'Microsoft SQL Server', false),
           ('de14560b-55f9-4177-9871-656cc94af2a6', 'Excel', false),

           ('c02de51d-d10a-4a49-87a4-43be5ebf6d2e', '500,000', false),
           ('c02de51d-d10a-4a49-87a4-43be5ebf6d2e', '5 million', false),
           ('c02de51d-d10a-4a49-87a4-43be5ebf6d2e', '50 million', true),
           ('c02de51d-d10a-4a49-87a4-43be5ebf6d2e', '500 million', false),

           ('40aeace0-7210-42cd-aa12-e274857b5a0b', '2001', false),
           ('40aeace0-7210-42cd-aa12-e274857b5a0b', '2009', false),
           ('40aeace0-7210-42cd-aa12-e274857b5a0b', '2012', true),
           ('40aeace0-7210-42cd-aa12-e274857b5a0b', '2018', false),

           ('7f3d9327-885c-4f15-b897-ed3a31c31baf', 'Python', false),
           ('7f3d9327-885c-4f15-b897-ed3a31c31baf', 'Flutter', false),
           ('7f3d9327-885c-4f15-b897-ed3a31c31baf', 'Javascript', true),
           ('7f3d9327-885c-4f15-b897-ed3a31c31baf', 'SSR', false),

           ('290ecdc8-aab0-490d-a894-06df33b7e92e', 'Denmark', false),
           ('290ecdc8-aab0-490d-a894-06df33b7e92e', 'Norway', true),
           ('290ecdc8-aab0-490d-a894-06df33b7e92e', 'Singapore', false),
           ('290ecdc8-aab0-490d-a894-06df33b7e92e', 'Kenya', false),

           ('a7a50c71-0ecb-4002-a527-a82724b37bc5', 'Steve Jobs', false),
           ('a7a50c71-0ecb-4002-a527-a82724b37bc5', 'Jordan Walke', true),
           ('a7a50c71-0ecb-4002-a527-a82724b37bc5', 'Dan Abramov', false),
           ('a7a50c71-0ecb-4002-a527-a82724b37bc5', 'Guido van Rossum', false),

           ('d8aba5d7-8b14-449e-a610-2455521d7ee1', '01010111', true),
           ('d8aba5d7-8b14-449e-a610-2455521d7ee1', '11010111', false),
           ('d8aba5d7-8b14-449e-a610-2455521d7ee1', '01000111', false),
           ('d8aba5d7-8b14-449e-a610-2455521d7ee1', '01010101', false);
