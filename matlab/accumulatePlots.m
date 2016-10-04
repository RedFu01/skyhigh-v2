for j=450:50:500
    clear duration hops duration_high duration_low
    conRadius = num2str(j);
    fname = strcat('resources/pathes_',conRadius,'nmi.json');
    fid = fopen(fname);
    raw = fread(fid,inf);
    str = char(raw');
    fclose(fid);

    data = JSON.parse(str);
    
    for i=1:1:length(data)
       hops(i) = data{i}.hops;
       duration(i) = data{i}.duration;

    end

    for i=1:1:length(data)
        if data{i}.hops> mean(hops)
        duration_high(i) = data{i}.duration;
        else
        duration_low(i) = data{i}.duration;    
        end

    end

    duration_high(duration_high==0) = [];
    duration_low(duration_low==0) = [];
    save(strcat('data/pathes',conRadius,'nmi'),'data','duration','duration_low','duration_high','hops');
end