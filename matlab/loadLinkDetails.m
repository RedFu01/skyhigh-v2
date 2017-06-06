clear all;
index = 0;
uuid = '600km_8de35f8d-af85-4d0a-bb1e-786cbcac664f';

cres = webread('http://localhost:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+1000;
    cres = webread('http://localhost:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded: ',num2str(length(data))));
end

% All Data loaded !