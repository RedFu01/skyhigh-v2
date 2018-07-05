clear all;
index = 0;
uuid = '600km_3b59def3-d9b4-4dc1-a05a-f08281a944ce';

cres = webread('http://localhost:3000/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+200;
    cres = webread('http://localhost:3000/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded:',{' '},num2str(length(data))));
end

% All Data loaded !