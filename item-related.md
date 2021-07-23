#Item
## Finding duplicate item supplier
```
select item, primary_supp_ind, count(*) from item_supplier 
where item in(select item from item_supplier where item in (select item from mau_stg_item_loc_ranging where loc = 2) 
	group by item having count(*) > 1)
group by item, primary_supp_ind
having count(*)> 1 order by item;
```
