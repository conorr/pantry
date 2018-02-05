create table if not exists events (
    sequence_id int not null auto_increment,
    type varchar(255) not null,
    version tinyint not null,
    namespace varchar(255),
    body varchar(20000) not null,
    created_utc datetime not null,
    primary key (sequence_id)
) engine=InnoDB;
