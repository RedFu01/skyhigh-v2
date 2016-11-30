clear all;
index = 0;
uuid = '05/11/2016_600km_11e3ab6c-0362-43ab-ab48-ddd7427443ff';

cres = webread('http://pioverzero.de:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
data = cres;
while ~isempty(cres)
    index = index+1000;
    cres = webread('http://pioverzero.de:3000/export/chunk', 'uuid',uuid,'start',index,weboptions('Timeout',3600000));
    data = cat(1, data,cres);
    disp(strcat('Loaded: ',num2str(length(data))));
end

% All Data loaded !