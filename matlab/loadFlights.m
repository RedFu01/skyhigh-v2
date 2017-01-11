clear all;
index = 0;
uuid = '05/11/2016_600km_c765cdbe-7a02-433d-b6ca-eb09b0c0f2f8';

cres = webread('http://localhost:3333/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+200;
    cres = webread('http://localhost:3333/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded:',{' '},num2str(length(data))));
end

% All Data loaded !