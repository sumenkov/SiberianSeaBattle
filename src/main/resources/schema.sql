create schema siberian_sea_battle;

create table players
(
    id varchar(36) not null,
    name varchar(255),
    created_at date
);

create table matches
(
    id varchar(36) not null,
    owner_id varchar(36),
    opponent_id varchar(36),
    created_at date
);

create table actions_history
(
    id varchar(36) not null,
    created_at date
)