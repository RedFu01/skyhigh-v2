clear all;
index = 0;
uuid = '600km_31a79e40-9fd2-41da-98fa-a7f309d5c756';

cres = webread('http://localhost:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+1000;
    cres = webread('http://localhost:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded: ',num2str(length(data))));
end

% All Data loaded !