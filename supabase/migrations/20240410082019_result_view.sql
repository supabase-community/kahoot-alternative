CREATE VIEW [Brazil Customers] AS
SELECT CustomerName, ContactName
FROM Customers
WHERE Country = 'Brazil';

create or replace view game_results as 
    select
        participants.id as participant_id,
        participants.nickname,
        sum(answers.score) as total_score,
        games.id as game_id
    from games
    inner join quiz_sets on games.quiz_set_id = quiz_sets.id
    inner join questions on quiz_sets.id = questions.quiz_set_id
    inner join answers on questions.id = answers.question_id
    inner join participants on participants.game_id = games.id
    group by participants.id, games.id;
