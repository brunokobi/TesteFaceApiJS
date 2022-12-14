const cam = document.getElementById('cam');
const span = document.getElementById("teste");
document.getElementById("teste").style.visibility = "hidden";
// const span = document.getElementById('teste');

const registro={
    matricula:String,
    data:Date,
    local:String
}

const options = {
    method:'GET',
    mode:'cors',
    cache:'default'
}
const alunos = [];




// fetch('http://localhost:3333/alunos',options)
// .then(response=>{response.json()
//     .then(data=> console.log(data))

// })
// .catch(e=>console.log('deu erro:'+ e,message))



function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => cam.srcObject = stream,
      err => console.error(err)
    )
  }

//parte do recolhecimento 
  const loadLabels = () => {
    const labels = ['Bruno']

   
    return Promise.all(labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 1; i++) {
            const img = await faceapi.fetchImage(`/assets/lib/face-api/labels/${label}/${i}.jpg`)
           // const img = await faceapi.fetchImage(`https://scontent.fvix1-1.fna.fbcdn.net/v/t31.0-8/12983896_10205539455718075_2440577530540952680_o.jpg?_nc_cat=108&_nc_sid=174925&_nc_ohc=K2p9-Krs3y4AX-5rZyH&_nc_ht=scontent.fvix1-1.fna&oh=912672f99e953fbb5271edb88358791c&oe=5F655A95`)
            const detections = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor()
            descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }))
}



Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models'),
]).then(startVideo)

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    const canvasSize = {
        width: cam.width,
        height: cam.height
    }
    const labels = await loadLabels()
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)
    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(
                cam,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()         
            .withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, canvasSize)
        const faceMatcher = new faceapi.FaceMatcher(labels,0.6)
        const results = resizedDetections.map(d =>
            faceMatcher.findBestMatch(d.descriptor)
        )
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
      
        results.forEach((result, index) => {
            const box = resizedDetections[index].detection.box
            const { label, distance } = result            
            const data = new Date();
            const cont = 0.00;
            
            if (distance * 100 > 50 && this.nome!=label&&label!='unknown'){                                 
                 registro.matricula = this.nome;
                 registro.data = data;
                 registro.local= 'campo';                                                        
                 span.innerHTML = 'Presence Now  =>  Matr??cula : '+registro.matricula;
                 document.getElementById("teste").style.visibility = "visible";
                 cam.style.backgroundColor='green';
                 cam.style.borderColor='green';                            
                 setTimeout(() => {                                
                     document.getElementById("teste").style.visibility = "hidden";
                     cam.style.backgroundColor='#0053c7';
                     cam.style.borderColor='#fff';                                
                 },3000);
                
            }          
           
            

            new faceapi.draw.DrawTextField([
                `${label} = ${distance *100}`
            ], box.bottomLeft).draw(canvas)
        })
    }, 100)
})

// probalidade do sexo
// (${parseInt(genderProbability * 100, 10)})

// probilidade de ser a pessoa
// (${parseInt(distance * 100, 10)})

