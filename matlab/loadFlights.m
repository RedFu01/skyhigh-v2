clear all;
index = 0;
uuid = '31/10/2016_600km';

cres = webread('http://pioverzero.de:3000/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+200;
    cres = webread('http://pioverzero.de:3000/export/flights/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded:',{' '},num2str(length(data))));
end

% All Data loaded !