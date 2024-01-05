alter table "public"."questions" drop constraint "questions_pkey";

drop index if exists "public"."questions_pkey";

alter table "public"."players" alter column "nickname" set not null;

CREATE UNIQUE INDEX problems_pkey ON public.questions USING btree (id);

alter table "public"."questions" add constraint "problems_pkey" PRIMARY KEY using index "problems_pkey";


