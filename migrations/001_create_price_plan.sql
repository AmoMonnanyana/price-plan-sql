create table if not exists price_plan (
    id integer primary key AUTOINCREMENT,
    plan_name text,
    sms_price real,
    call_price real
);

create table if not exists submitted_bill_history (
id integer primary key AUTOINCREMENT,
price_plan text,
actions text,
total text
);