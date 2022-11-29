gsap.registerPlugin(SplitText);

let webgl = {};
let tail = {};

(function initThree() {
    webgl.container = document.getElementById("canvas_container");
    webgl.quoteText = document.querySelector(".quoteText");
    webgl.text = document.querySelector(".text");

    webgl.scene = new THREE.Scene();
    webgl.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    webgl.camera.position.z = 180;
    webgl.renderer = new THREE.WebGLRenderer({ alpha: true });  //, antialias: true
    webgl.renderer.setSize(webgl.container.clientWidth, webgl.container.clientHeight);
    webgl.renderer.setPixelRatio(window.devicePixelRatio);
    webgl.container.appendChild(webgl.renderer.domElement);

    webgl.loader = new THREE.TextureLoader();
    webgl.clock = new THREE.Clock(true);
    webgl.loader.crossOrigin = '';

    webgl.textureIndex = 1;
    webgl.threshold = 30;
    webgl.lastClick = 0;
    tail.on = false;

    webgl.texture = webgl.loader.load(document.getElementById("first").src, setup);

    Promise.all([
        webgl.texture,                               
        webgl.loader.load('https://i.ibb.co/s9HkwNV/elige.jpg'),
        webgl.loader.load('https://i.ibb.co/wKcTwXQ/Fecha.jpg'),
        loadAsync("https://i.imgur.com/rjIx9k8.mp4"),
        webgl.loader.load('https://i.ibb.co/DYYgGrg/Ella.jpg'),
        webgl.loader.load('https://i.ibb.co/3MzPSM6/Love.jpg'),
        webgl.loader.load('https://i.ibb.co/J2yPy2d/La-Mejor-Amiga.jpg'),
        webgl.loader.load('https://i.ibb.co/NghmRq8/Mama-de-valeria.jpg'),
        webgl.loader.load('https://i.ibb.co/d6gKJVQ/Pudul.jpg'),
        webgl.loader.load('https://i.ibb.co/997DPH8/Misha.jpg'),
        webgl.loader.load('https://i.ibb.co/Yy7LQZh/corazon-1.jpg'),
        webgl.loader.load('https://i.ibb.co/3p9CgWB/Castrosos.jpg'),
        webgl.loader.load('https://i.ibb.co/hVh26D8/Bebo.jpg'),
        loadAsync("https://i.imgur.com/uZ02cCZ.mp4"),
        webgl.loader.load('https://i.ibb.co/6RDQw7c/Me-dijo-que-si-1.jpg'),
        webgl.loader.load('https://i.ibb.co/drPgXcq/2-corazones.png'),
        loadAsync("https://i.imgur.com/v5CsDAm.mp4"),
        webgl.loader.load('https://i.ibb.co/qmH4MNw/Scrat-Nuez.png'),
        loadAsync("https://i.imgur.com/fhFe43P.mp4"), 
        loadAsync("https://i.imgur.com/XnFZDFX.mp4"),
        loadAsync("https://i.imgur.com/5WAil3z.mp4"),
        webgl.loader.load('https://i.ibb.co/nC5dMtd/Kids-y-su-patinetaa.jpg'),
        loadAsync("https://i.imgur.com/iqNShfK.mp4"),
        webgl.loader.load('https://i.ibb.co/CJJV89t/Padrinos-magicos.jpg'),
        webgl.loader.load('https://i.ibb.co/pJYpYRr/Garyyy.jpg'),
        webgl.loader.load('https://i.ibb.co/5WYCpZ6/Shek-Yfionba.jpg'),
        webgl.loader.load('https://i.ibb.co/mNYfS66/Ramy-1.jpg'),
        loadAsync("https://i.imgur.com/lALKicE.mp4"),
        loadAsync("https://i.imgur.com/ZHbhE1w.mp4"),
        loadAsync("https://i.imgur.com/W84LtMx.mp4"),
        webgl.loader.load('https://i.ibb.co/FqDdBPt/Por-hacer.jpg'),
        loadAsync("https://i.imgur.com/L5NBXb3.mp4"),
        loadAsync("https://i.imgur.com/dvn2OgO.mp4"),
        loadAsync("https://i.imgur.com/5pTJeb8.mp4"),  
    ]).then(result => {
        webgl.texturesArray = result;
        document.getElementById("wrapper").addEventListener("click", changeTexture, false);
    });

    async function loadAsync(url) {
        let video = document.createElement("video");
        video.muted = true;
        video.loop = true;
        video.playsinline = true;
        video.crossOrigin = "anonymous";
        video.src = url;
        return new THREE.VideoTexture(video);
    }
       
    webgl.texturesOptions = [
        { index: 0, texture: "image", quote: 'Puedes presionar el boton de abajo a la derecha que dice <span style="color:#666666">Regalo</span><br> <em>O puedes volver a ver todas las fotos que te preparé :)</em>', threshold: 20, random: 4.0, depth: 30.0, size: 1.7, square: 0 },
        { index: 1, texture: "image", quote: 'Te prepare una serie de fotos y vídeos, junto algunas palabras, <br> <span style="color:#f4852a"> espero te guste :)</span>', threshold: 60, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 2, texture: "image", quote: '“Todo comenzó un 4 de julio de 2019 con aquél mensaje...<br>que sin darnos cuenta, sería el comienzo de una<span style="color:#3ac5f8"> bonita amistad y después el de una relación”</span>', threshold: 10, random: 1.0, depth: 2.0, size: 1.2, square: 0},
        { index: 3, texture: "video", quote: 'Hemos hablado de tantas cosas que ya ni debemos de acordarnos muchas de ellas... <br> tan solo recordar el <span style="color:#a87171; font-style: italic;"> “Aaa y me debes tu cuaderno” ^-^</span>', threshold: 100, random: 2.0, depth: 2.0, maxDepth: 60, size: 1.5, square: 0 },
        { index: 4, texture: "image", quote: '&nbsp;&nbsp;“ Quise hacerte este detalle con mi toque especial <br> para que pudieras ver lo mucho que <span style="color:#f81b1b">te amo</span> ”', threshold: 80, random: 1.0, depth: 4.0, maxDepth:120, size: 1.5, square: 0 },
        { index: 5, texture: "image", quote: 'Pues preparé una serie de <span style="color:#c89c5b">fotos </span>y <span style="color:#c89c5b">vídeos</span>, con un diseño un tanto peculiar jsjs', threshold: 30, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 6, texture: "image", quote: 'Una con tu <span style="color:#f14646">mejor amiga </span>, que siempre esta contigo', threshold: 30, random: 2.0, depth: 3.0, size: 1.0, square: 1 },
        { index: 7, texture: "image", quote: 'También con tu <span style="color:#e7aa27">madre</span>, <br> que es la que siempre te aconseja', threshold: 60, random: 0.8, depth: 4.0, size: 0.6, square: 1 },
        { index: 8, texture: "image", quote: 'Otra con tu bebe de toda la vida, que es <span style="color:#f4852a">pudul</span>', threshold: 20, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 9, texture: "image", quote: 'Cuando quería botar a la <span style="color:#C32B59">misha</span> jsjs', threshold: 20, random: 2.0, depth: 8.0, size: 1.5, square: 0, a2: true },
        { index: 10, texture: "image", quote: '<span style="color:#eeb9b9">TE AMOOOO</span><span style="color:#e89191"> Barbara <3</span><br>', threshold: 30, random: 2.0, depth: 30.0, maxDepth: 100, size: 1.5, square: 0, a3: true, a4: true, stagger: 0.3 },  //72
        { index: 11, texture: "image", quote: 'Bueno seguimos, aquí una foto con los castroso de tus <br> <span style="font-style: italic; color:#f91a1a">compañeros </span> jsjs ', threshold: 60, random: 2.0, depth: 2.0, maxDepth: 80, size: 1.5, square: 0, color: "transparent", stagger: 1 },
        { index: 12, texture: "image", quote: 'Como no mencionar al hermoso de <span style="color:#f3ee62">BEBO</span>', threshold: 60, random: 2.0, depth: 4.0, maxDepth: 60, size: 1.5, square: 0 },
        { index: 13, texture: "video", quote: 'Festejando tus <span style="color:#f91a1a">17 </span>añitos <span style="font-style: italic; font-size: 1.5vw; color:#f77e7e"> <3 </span>', threshold: 60, random: 2.0, depth: 15.0, maxDepth: 120, size: 2.0, square: 0, stagger: 1 },
        { index: 14, texture: "image", quote: '“22 de noviembre de 2022”<br> Fue la fecha en donde me diste el <span style="font-style: italic; color:#c8664c"> "Si" </span> que llevaba tiempo esperando como respuesta', threshold: 20, random: 2.0, depth: 4.0, maxDepth:180, size: 1.5, square: 0 },
        { index: 15, texture: "image", quote: 'Recuerda esa fecha, será importante para los dos <3 <br><span style="color:#b3be1e">tan solo me queda decirte que...</span> ', threshold: 0, random: 2.0, depth: 3.0, maxDepth: 100, size: 1.5, square: 0, a5: true },
        { index: 16, texture: "video", quote: 'Te quiero de muchas formas <br> <span style="color:#e76e6e">Barbara...</span>  <span style="color:#e33131"></span>', threshold: 100, random: 4.0, depth: 20.0, maxDepth: 100, size: 1.5, square: 0, a4: true },
        { index: 17, texture: "image", quote: 'Te quiero tanto, como <span style="color:#f17946">Scrat </span>quiere a su nuez ^_^', threshold: 60, random: 2.0, depth: 40.0, maxDepth: -100, size: 1.5, square: 0, a6: true },
        { index: 18, texture: "video", quote: 'Te quiero tanto, como los <span style="color:#259be9">minios quieren a Gru</span>', threshold: 30, random: 2.0, depth: 20.0, maxDepth: 80, size: 1.5, square: 0 },
        { index: 19, texture: "video", quote: ' Te quiero tanto, como <span style="color:#259be9">Homero quiere a Marge</span>', threshold: 30, random: 2.0, depth: 30.0, maxDepth: 100, size: 1.5, square: 0, a8:true },
        { index: 20, texture: "video", quote: 'Te quiero tanto, como <span style="color:#fac370">Ash quiere a Pikachu</span>', threshold: 100, random: 2.0, depth: 10.0, size: 1.5, square: 0 },
        { index: 21, texture: "image", quote: ' Te quiero tanto, como <span style="color:#979f28">Kid buttowski quiere su patineta</span> ', threshold: 30, random: 1.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 22, texture: "video", quote: 'Te quiero tanto, como las ganas de pelear de <span style="font-style: italic; color:#3bbbd8">Señor gato con Kid</span>', threshold: 30, random: 2.0, depth: 30.0, maxDepth: -50, size: 1.5, square: 0 },
        { index: 23, texture: "image", quote: " Te quiero tanto, como  <span style='color:#f2f637'>Timmy quiere a sus padrinos mágicos</span>", threshold: 30, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 24, texture: "image", quote: 'Te quiero tanto, como <span style="color:#ea1f66">Bob esponja quiere a Gary</span>', threshold: 10, random: 2.0, depth: 4.0, size: 1.5, square: 0 },
        { index: 25, texture: "image", quote: 'Te quiero tanto, como <span style="color:#ec1713">Shek quiere a Fiona</span>', threshold: 20, random: 2.0, depth: 4.0, size: 1.5, square: 0, a1: true },
        { index: 26, texture: "image", quote: 'Te quiero tanto, como <span style="color:#D873EE">Remy ama tanto cocinar</span>', threshold: 20, random: 2.0, depth: 4.0, maxDepth:150, size: 1.5, square: 0, a10:false},
        { index: 27, texture: "video", quote: 'Te quiero tanto, como <span style="color:#D873EE">Peter Parker ama a Gwen Stacy</span>', threshold: 30, random: 2.0, depth: 15.0, maxDepth: 50, size: 1.5, square: 0, a6:true },
        { index: 28, texture: "video", quote: 'Y te amo tanto como <span id="paint_only" style="color:#D234EB">Gleen amo a Maggi</span>', threshold: 60, random: 2.0, depth: 18.0, size: 1.5, square: 0, a9:true },
        { index: 29, texture: "video", quote: '<span style="color:#f1ee46">GRACIAS</span>', threshold: 150, random: 2.0, depth: 20.0, maxDepth: 70, bg: '#000', size: 1.5, square: 0 },
        { index: 30, texture: "image", quote: '<span style="color:#ea1f66">POR HACER</span> ', threshold: 60, random: 2.0, depth: 4.0, size: 1.5, square: 0, a4:true, a1:true },
        { index: 31, texture: "video", quote: '<span style="color:#f6a62c">DE MIS DÍAS</span>', threshold: 100, random: 2.0, depth: 10.0, maxDepth: 60, size: 1.5, square: 0, a1: true },
        { index: 32, texture: "video", quote: '<span style="color:#f91a1a"> MÁS FELICES</span>', threshold: 160, random: 2.0, depth: 3.0, size: 1.5, square: 0 },
        { index: 33, texture: "video", quote: '<span style="color:#f4e25d">TE AMO</span>', threshold: 60, random: 2.0, depth: 5.0, maxDepth: 40.0, size: 1.5, square: 0 },
    ];
})();


function setup() {
    pixelExtraction();
    initParticles();
    initTail();
    initRaycaster();

    window.addEventListener("resize", () => {
        clearTimeout(webgl.timeout_Debounce);
        webgl.timeout_Debounce = setTimeout(resize, 50);
    });
    resize();

    webgl.scene.add(webgl.particlesMesh);

    webgl.firstAnimation1 = gsap.to(webgl.particlesMesh.rotation, 30, { z: 2, repeat: -1, yoyo: true });
    webgl.firstAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 2, { value: 30 }, { value: 45.0, ease: "elastic.in(1, 0.3)", delay: 2 });

    webgl.timeoutClickInfo = window.setTimeout(() => {
        if (webgl.textureIndex == 1) gsap.to(document.querySelector(".clickInfo"), 1.5, { top: 0, ease: "power4.out" });
        else return;
    }, 4000);

    animate();
}


function pixelExtraction() {
    webgl.width = webgl.texture.image.width;
    webgl.height = webgl.texture.image.height;
    webgl.totalPoints = webgl.width * webgl.height;
    webgl.visiblePoints = 0;
    webgl.threshold = webgl.texturesOptions[webgl.textureIndex].threshold;

    const img = webgl.texture.image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = webgl.width;
    canvas.height = webgl.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, webgl.width, webgl.height * -1);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    webgl.arrayOfColors = Float32Array.from(imgData.data);
    for (let i = 0; i < webgl.totalPoints; i++) {
        if (webgl.arrayOfColors[i * 4 + 0] > webgl.threshold) webgl.visiblePoints++;
    }
}


function initParticles() {
    webgl.geometryParticles = new THREE.InstancedBufferGeometry();

    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    webgl.geometryParticles.setAttribute('position', positions);

    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    webgl.geometryParticles.setAttribute('uv', uvs);

    webgl.geometryParticles.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    const offsets = new Float32Array(webgl.totalPoints * 3); 
    const indices = new Uint16Array(webgl.totalPoints);
    const angles = new Float32Array(webgl.totalPoints);
    for (let i = 0, j = 0; i < webgl.totalPoints; i++) {
        if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue;
        offsets[j * 3 + 0] = i % webgl.width;
        offsets[j * 3 + 1] = Math.floor(i / webgl.width);
        indices[j] = i;
        angles[j] = Math.random() * Math.PI;
        j++;
    }

    webgl.geometryParticles.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    webgl.geometryParticles.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));
    webgl.geometryParticles.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));

    const uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 3.0 },
        uDepth: { value: 30.0 },
        uSize: { value: 1.5 },    
        uTextureSize: { value: new THREE.Vector2(webgl.width, webgl.height) },
        uTexture: { value: webgl.texture },
        uTouch: { value: null },            
        uAlphaCircle: { value: 0.0 },        
        uAlphaSquare: { value: 1.0 },
        uCircleORsquare: { value: 0.0 }, 
    };

    const materialParticles = new THREE.RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        depthTest: false,
        transparent: true,
    });
    webgl.particlesMesh = new THREE.Mesh(webgl.geometryParticles, materialParticles);
}


function initTail() {
    tail.array = [];
    tail.size = 80;
    tail.maxAge = 70;
    tail.radius = 0.08;
    tail.red = 255;
    tail.canvas = document.createElement('canvas');
    tail.canvas.width = tail.canvas.height = tail.size;
    tail.ctx = tail.canvas.getContext('2d');
    tail.ctx.fillStyle = 'black';
    tail.ctx.fillRect(0, 0, tail.canvas.width, tail.canvas.height);
    tail.texture = new THREE.Texture(tail.canvas);
    webgl.particlesMesh.material.uniforms.uTouch.value = tail.texture;
}


function initRaycaster() {
    const geometryPlate = new THREE.PlaneGeometry(webgl.width, webgl.height, 1, 1);
    const materialPlate = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
    materialPlate.visible = false;
    webgl.hoverPlate = new THREE.Mesh(geometryPlate, materialPlate)
    webgl.scene.add(webgl.hoverPlate);
    webgl.raycaster = new THREE.Raycaster();
    webgl.mouse = new THREE.Vector2(0, 0);
    window.addEventListener("mousemove", onMouseMove, false);
}


function onMouseMove(event) {
    webgl.mouse.x = (event.clientX / webgl.renderer.domElement.clientWidth) * 2 - 1;
    webgl.mouse.y = - (event.clientY / webgl.renderer.domElement.clientHeight) * 2 + 1;
    webgl.raycaster.setFromCamera(webgl.mouse, webgl.camera);
    let intersects = webgl.raycaster.intersectObjects([webgl.hoverPlate]);
    webgl.particlesMesh.rotation.y = webgl.mouse.x / 8;
    webgl.particlesMesh.rotation.x = -webgl.mouse.y / 8;
    if (intersects[0] && tail.on) buildTail(intersects[0].uv);
}


function buildTail(uv) {
    let force = 0;
    const last = tail.array[tail.array.length - 1];
    if (last) {
        const dx = last.x - uv.x;
        const dy = last.y - uv.y;
        const dd = dx * dx + dy * dy;
        force = Math.min(dd * 10000, 1);
    }
    tail.array.push({ x: uv.x, y: uv.y, age: 0, force });
}



function changeTexture(e) {

    if (Date.now() - webgl.lastClick < 800) return;
    webgl.lastClick = Date.now();

    if (webgl.texturaAnimation0) webgl.texturaAnimation0.kill();
    if (webgl.texturaAnimation1) webgl.texturaAnimation1.kill();
    if (webgl.texturaAnimation2) webgl.texturaAnimation2.kill();
    if (webgl.texturaAnimation5) webgl.texturaAnimation5.kill();
    webgl.particlesMesh.rotation.z = 0.0;

    if (e.target.classList.contains("btn")) return;

    let opt = webgl.texturesOptions[webgl.textureIndex];
    let t = webgl.texturesArray[webgl.textureIndex];

    if (webgl.textureIndex == 1) {
        webgl.firstAnimation1.kill(null, "z");
        webgl.firstAnimation2.kill();
        gsap.fromTo(webgl.particlesMesh.rotation, 0.3, { z: 0.5 }, { z: 0 });
        clearTimeout(webgl.timeoutClickInfo);
        gsap.to(document.querySelector(".clickInfo"), 1, { top: -80, ease: "power4.out" }, 0);
    }

    tail.on = true;

    webgl.width = 250;   
    webgl.height = 145;   

    if (opt.texture == "video") {
        webgl.video = t.image;
        webgl.video.currentTime = 0;
        webgl.texture = t;
        webgl.particlesMesh.material.uniforms.uTexture.value = t;
        webgl.totalPoints = webgl.width * webgl.height;
        //webgl.texture.needsUpdate = true; 
        webgl.video.play(); 
    } else {
        webgl.texture = t;
        webgl.particlesMesh.material.uniforms.uTexture.value = t;
    }

    webgl.particlesMesh.material.uniforms.uTextureSize.value.x = webgl.width;
    webgl.particlesMesh.material.uniforms.uTextureSize.value.y = webgl.height;
    webgl.particlesMesh.material.uniforms.uRandom.value = opt.random;
    webgl.particlesMesh.material.uniforms.uDepth.value = opt.depth;         
    webgl.particlesMesh.material.uniforms.uSize.value = opt.size;
    webgl.particlesMesh.material.uniforms.uCircleORsquare.value = opt.square;

    if (opt.texture != "video") pixelExtraction();

    const offsets = new Float32Array(webgl.totalPoints * 3);
    const indices = new Uint16Array(webgl.totalPoints);
    const angles = new Float32Array(webgl.totalPoints);

    for (let i = 0, j = 0; i < webgl.totalPoints; i++) {
        if (opt.texture != "video") if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue;
        if (webgl.textureIndex === 18) if (webgl.arrayOfColors[i * 4 + 0] <= webgl.threshold) continue; 
        offsets[j * 3 + 0] = i % webgl.width;
        offsets[j * 3 + 1] = Math.floor(i / webgl.width);
        indices[j] = i;
        angles[j] = Math.random() * Math.PI;

        j++;
    }
    webgl.geometryParticles.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    webgl.geometryParticles.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));
    webgl.geometryParticles.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));

    webgl.textureIndex++;

    if (webgl.textureIndex === webgl.texturesOptions.length) webgl.textureIndex = 0;
    if (!opt.maxDepth) opt.maxDepth = 30;

    let tl = gsap.timeline();
    tl.fromTo(webgl.quoteText, 0.5, { opacity: 1 }, { opacity: 0 }, 0);
    tl.fromTo(webgl.text, 1, { rotation: 0 }, { rotation: 180, transformOrigin: "center", ease: "power2.out" }, 0);
    tl.call(() => {
        webgl.quoteText.innerHTML = opt.quote;
        gsap.set(webgl.quoteText, { rotation: 180, opacity: 1, transformOrigin: "center" });
        let split = new SplitText(".quoteText", { type: "lines,words,chars" });
        if (!opt.stagger) opt.stagger = 0.3;
        if (opt.a4) {
            webgl.texturaAnimation5 = gsap.from(split.words, { duration: 0.5, y: 100, rotationX: -60, stagger: opt.stagger });
        } else {
            gsap.set(".quoteText", { perspective: 400 });
            gsap.from(split.lines, { duration: 0.5, opacity: 0, rotationX: -60, force3D: true, transformOrigin: "0 center -150", stagger: opt.stagger });
        }
    }, null, 0.5);

    if (opt.a1) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: -20 }, { value: 20, ease: "power2.out", repeat: -1, yoyo: true });
    } else if (opt.a2) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uRandom, 1, { value: 0 }, { value: -40, ease: "power2.out", repeatDelay: 0.5, repeat: -1, yoyo: true });
    } else if (opt.a3) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: 20 }, { value: 50, ease: "power2.out", repeat: -1, repeatDelay: 0.5, yoyo: true });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uSize, 1, { value: 0 }, { value: 1.5, ease: "power2.out", repeatDelay: 0.5, repeat: -1, yoyo: true });
    } else if (opt.a5) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth, ease: "power3.out", delay: 2 });
        webgl.texturaAnimation5 = gsap.fromTo(webgl.particlesMesh.rotation, 5, { z: 0.0 }, { z: THREE.Math.degToRad(360), ease: "bounce.out", delay: 5 });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.position, 5, { z: 0.0 }, { z: -80, ease: "bounce.out", delay: 5 });
    } else if (opt.a6) {
        webgl.texturaAnimation5 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 6, { value: 20 }, { value: -200, ease: "power3.out", yoyoEase: "bounce.out", delay: 2, yoyo: true, repeat: 1 });
    } else if (opt.a7) {
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: 10, ease: "bounce.out", delay: 2, yoyo: true, repeat: 1 });
        webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.position, 2, { z: 0.0 }, { z: 60.0, ease: "elastic.in(1, 0.3)" });
    } else if (opt.a8) {
            webgl.video.loop = false;
    } else if (opt.a11) { 
            webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 1, { value: 4 }, { value: 40, ease: "power2.out", repeat: -1, yoyo: true, repeatDelay:0.5 });
    } else {
        webgl.texturaAnimation0 = tl.fromTo(webgl.text, 1, { scale: 1 }, { scale: 1.3, transformOrigin: "center", ease: "elastic.in(1, 0.3)", yoyo: true, repeat: 1 }, 2.8);
        webgl.texturaAnimation1 = gsap.fromTo(webgl.particlesMesh.position, 4, { z: 0.0 }, { z: 15.0, ease: "elastic.in(1, 0.3)", yoyo: true, repeat: 1, repeatDelay: 5 });

        if (opt.texture === "video") {
            webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth / 2, ease: "elastic.in(1, 0.3)", repeatDelay: 5, repeat: 1, yoyo: true });
        } else
            webgl.texturaAnimation2 = gsap.fromTo(webgl.particlesMesh.material.uniforms.uDepth, 4, { value: opt.depth }, { value: opt.maxDepth, ease: "elastic.in(1, 0.3)", repeatDelay: 5, repeat: 1, yoyo: true });

        if (opt.a10) {
            webgl.texturaAnimation1 = gsap.set(webgl.particlesMesh.material.uniforms.uTexture, { value: webgl.loader.load("https://i.ibb.co/0qhkwkd/20cc.jpg"), delay: 4 })
        }
    }
}


function animate() {
    webgl.particlesMesh.material.uniforms.uTime.value += webgl.clock.getDelta();

    if (tail.on) drawTail();
    tail.texture.needsUpdate = true;
    webgl.texture.needsUpdate = true;
    webgl.renderer.render(webgl.scene, webgl.camera);
    webgl.raf = requestAnimationFrame(animate);
}


function drawTail() {
    tail.ctx.fillStyle = 'black';
    tail.ctx.fillRect(0, 0, tail.canvas.width, tail.canvas.height);
    tail.array.forEach((point, i) => {
        point.age++;
        if (point.age > tail.maxAge) {
            tail.array.splice(i, 1);
        } else {
            const pos = {
                x: point.x * tail.size,
                y: (1 - point.y) * tail.size
            };

            let intensity = 1;
            if (point.age < tail.maxAge * 0.3) {
                intensity = easeOutSine(point.age / (tail.maxAge * 0.3), 0, 1, 1);
            } else {
                intensity = easeOutSine(1 - (point.age - tail.maxAge * 0.3) / (tail.maxAge * 0.7), 0, 1, 1);
            }
            intensity *= point.force;
            const radius = tail.size * tail.radius * intensity;
            const grd = tail.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
            grd.addColorStop(0, 'rgba(' + tail.red + ', 255, 255, 0.2)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0.0)');

            tail.ctx.beginPath();
            tail.ctx.fillStyle = grd;
            tail.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            tail.ctx.fill();
        }
    });
}

const easeOutSine = (t, b, c, d) => {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};


function resize() {
    let f = 0.1;
    webgl.camera.aspect = webgl.container.clientWidth / webgl.container.clientHeight;
    webgl.camera.updateProjectionMatrix();
    webgl.renderer.setSize(webgl.container.clientWidth, webgl.container.clientHeight);
    if (window.innerWidth / window.innerHeight < 2.8) f = -0.2;
    const fovHeight = 2 * Math.tan((webgl.camera.fov * Math.PI) / 180 / 2) * webgl.camera.position.z;
    const scale = fovHeight / webgl.height + f;        
    webgl.particlesMesh.scale.set(scale, scale, 1);
    if (webgl.hoverPlate) webgl.hoverPlate.scale.set(scale, scale, 1);
}


let fsEnter = document.getElementById('fullscr');
fsEnter.addEventListener('click', function (e) {
    e.preventDefault();
    if (!webgl.fullscreen) {
        webgl.fullscreen = true;
        document.documentElement.requestFullscreen();
        fsEnter.innerHTML = "Salir";
    }
    else {
        webgl.fullscreen = false;
        document.exitFullscreen();
        fsEnter.innerHTML = "Volver";
    }
});


function vertexShader() {
    return `
        precision highp float;
        attribute float pindex;
        attribute vec3 position;
        attribute vec3 offset;
        attribute vec2 uv;
        attribute float angle;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uRandom;
        uniform float uDepth;
        uniform float uSize;
        uniform vec2 uTextureSize;
        uniform sampler2D uTexture;
        uniform sampler2D uTouch;
        varying vec2 vPUv;
        varying vec2 vUv;
        
        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec2 mod289(vec2 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec3 permute(vec3 x) {
            return mod289(((x*34.0)+1.0)*x);
        }
        
        float snoise(vec2 v)
            {
            const vec4 C = vec4(0.211324865405187, 
                                0.366025403784439, 
                            -0.577350269189626,  
                                0.024390243902439); 
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
        
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
        
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
        
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
        
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        float random(float n) {
            return fract(sin(n) * 43758.5453123);
        }
        
        void main() {
            vUv = uv;
            
            vec2 puv = offset.xy / uTextureSize;
            vPUv = puv;
        
            vec4 colA = texture2D(uTexture, puv);
            float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
        
            vec3 displaced = offset;     
            displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
            float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));  
            displaced.z += rndz * (random(pindex) * 2.0 * uDepth);               
            displaced.xy -= uTextureSize * 0.5;
        
            float t = texture2D(uTouch, puv).r;
            displaced.z += t * -40.0 * rndz;
            displaced.x += cos(angle) * t * 40.0 * rndz;
            displaced.y += sin(angle) * t * 40.0 * rndz;     //20
        
            float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
            psize *= max(grey, 0.2);
            psize *= uSize;
        
            vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
            mvPosition.xyz += position * psize;
            gl_Position = projectionMatrix * mvPosition;
        }
    `
}

function fragmentShader() {
    return `
        precision highp float;
        uniform sampler2D uTexture;
        uniform float uAlphaCircle;        
        uniform float uAlphaSquare;          
        uniform float uCircleORsquare;
        varying vec2 vPUv;
        varying vec2 vUv;
        void main() {
            vec4 color = vec4(0.0);
            vec2 uv = vUv;
            vec2 puv = vPUv;
            vec4 colA = texture2D(uTexture, puv);
            float border = 0.3;
            float radius = 0.5;
            float dist = radius - distance(uv, vec2(0.5));   
            float t = smoothstep(uCircleORsquare, border, dist);
            color = colA;
            color.a = t;
            //gl_FragColor = vec4(color.r, color.g, color.b, uAlphaSquare);
            gl_FragColor = vec4(color.r, color.g, color.b, t - uAlphaCircle);
        }
    `
}