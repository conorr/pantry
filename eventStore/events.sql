create table if not exists events (
    sequence_id int not null auto_increment,
    type varchar(255) not null,
    version tinyint not null,
    body varchar(21555) not null,
    created_utc datetime not null,
    primary key (sequence_id)
) engine=InnoDB;