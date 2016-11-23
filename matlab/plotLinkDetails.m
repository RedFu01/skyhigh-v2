uuid = '05/11/2016_600km_d762aec4-22e5-438b-8aec-c1f06cff8246';
data = webread('http://orion6:3000/export/', 'uuid',uuid,weboptions('Timeout',360));

for i=1:1:length(data)
   currentLink = data(i); 
    
end