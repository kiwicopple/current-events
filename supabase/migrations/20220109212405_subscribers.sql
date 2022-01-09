create view subscribers as
select 
  email,
  subscribed
from 
  auth.users
join 
  profiles
on 
  auth.users.id = profiles.id
where 
  subscribed = true;