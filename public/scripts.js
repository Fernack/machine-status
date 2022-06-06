function upload() {    
    const formData = new FormData();
    const file = document.getElementById("file");
    const upload = document.getElementById("upload");    
    const element = document.getElementById("loader");

    if (file.files.length === 0){
        alert('empty file');
    }
    else {
    
        element.classList.add("loader");
        upload.remove();

        formData.append("file", file.files[0]);

        fetch("http://localhost:3000", {
            method: 'POST',
            body: formData,
        }).then(response => response.json()).then(rawData => {
            element.classList.remove("loader");

            let points = [];

            for (let i = 0; i < rawData.data.length; i++) {
                points.push({x: rawData.data[i].date, y: rawData.data[i].avgvalue });
            }
            
            createDataset(points, rawData.type, rawData.maxValue);
            createAnnotations(rawData.operatingLoad, rawData.maxValue);

            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );                       
        })
        .catch(err => {
            console.log(err);
            element.classList.remove("loader");
        });        
    }
}

const config = {
    type: 'line',
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    time: {
                        unit: 'minute'
                    }
                },
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x',
                }
            }
        }
    }
};


createAnnotations = (operatingLoad, maxValue) => {
    const minOperatingLoad = operatingLoad - (operatingLoad * 20 /100);
    const unloaded = operatingLoad * 10 /100;

    config.options.plugins.annotation = {
        annotations: [{
                type: 'box',
                yMin: minOperatingLoad,
                yMax: maxValue,
                backgroundColor: 'rgba(0, 150, 0, 0.2)',
                label: {
                    content: 'On - loaded',
                    enabled: true
                },
                drawTime: 'beforeDatasetsDraw',
                borderWidth: 0,
                borderRadius: 0,
            },
            {
                type: 'box',
                yMin: unloaded,
                yMax: minOperatingLoad,
                label: {
                    content: 'On - idle',
                    enabled: true,
                },
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                drawTime: 'beforeDatasetsDraw',
                borderWidth: 0,
                borderRadius: 0,
            },
            {
                type: 'box',
                yMin: 0,
                yMax: unloaded,
              //  label: {
               //     content: 'On - unloaded',
                //    enabled: true,
               // },
                backgroundColor: 'rgba(255, 0, 0, 0.2)',                        
                drawTime: 'beforeDatasetsDraw',
                borderWidth: 0,
                borderRadius: 0,
            }, {
                type: "line",
                mode: "horizontal",
                scaleID: "y",
                value: unloaded,
                borderWidth: 0,
                borderRadius: 0,
                label: {
                    backgroundColor: 'transparent',
                    content: "On - unloaded",
                    enabled: true,
                    yAdjust: unloaded / 2,
                    color: 'black'
                }
            }]
        };
}


createDataset = (data, type, maxValue) => {
    config.data = {
        datasets: [{
            label: 'Machine Status: ' + type.toUpperCase(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            data: data,
            pointRadius: 1
        }]
    };

    config.options.scales.y = {
        max: maxValue
    }
}