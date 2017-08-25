declare function require(x: string): any;
const Stats = require('stats-js');
import Scene01 from "Scene01";
export default class Mapper{

    public scene: THREE.Scene;
    public camera: THREE.OrthographicCamera;
    private renderer:THREE.WebGLRenderer;
    private geometry:THREE.BoxGeometry;
    private material:THREE.MeshBasicMaterial;
    private cube:THREE.Mesh;

    private container:any;
    private stats:any;
    private raycaster:THREE.Raycaster;
    private mouse:THREE.Vector2 = new THREE.Vector2();
    private screenWidth:number = window.innerWidth;
    private screenHeight:number = window.innerHeight;

    private dragableObjs:THREE.Mesh[] = [];
    private controls:any;

    private screenGeo:THREE.PlaneGeometry;
    private screenMat:THREE.MeshBasicMaterial;


    private maskGeo:THREE.PlaneGeometry;
    private maskMat:THREE.MeshBasicMaterial;
    private mask:THREE.Mesh;

    private isMouseDown:boolean = false;

    private planePosZ:number = -0.8;

    private raycastedObjs:any[] = [];

    public rendertarget:THREE.WebGLRenderTarget;
    public scene01:Scene01;


    // ******************************************************
    constructor(scnene01) {
        this.scene01 = scnene01;
        this.createScene();
        this.animate();


        console.log("scene created!")
    }

    // ******************************************************
    private createScene()
    {


        this.container = document.createElement( 'div' );
        document.body.appendChild( this.container );
        var aspect = window.innerWidth / window.innerHeight;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        var frustumSize = 1000;
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
        this.camera.position.set(0,0,0.001);

        this.camera.position.set(0,0,0);



        this.scene = new THREE.Scene();
        // this.controls = new THREE.TrackballControls(this.camera );
        // this.controls.rotateSpeed = 1.0;
        // this.controls.zoomSpeed = 1.2;
        // this.controls.panSpeed = 0.8;
        // this.controls.noZoom = false;
        // this.controls.noPan = false;
        // this.controls.staticMoving = true;
        // this.controls.dynamicDampingFactor = 0.3;

        this.scene.add( new THREE.AmbientLight( 0xffffff ) );




        var textureLoader = new THREE.TextureLoader();
        var background = textureLoader.load("/models/pal/texture/image_0.png");


        this.rendertarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            }
        );
        this.screenGeo = new THREE.PlaneGeometry(1*aspect,1,3,3);
        this.screenMat = new THREE.MeshBasicMaterial({side:THREE.DoubleSide,map: this.rendertarget.texture});

        let screen = new THREE.Mesh(this.screenGeo,this.screenMat );


        // screen.material.wireframe = true;
        screen.position.set(0,0,this.planePosZ);
        this.scene.add(screen);


        this.maskGeo = new THREE.PlaneGeometry(0.1,0.15);
        this.maskMat = new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:1.0});

        this.mask = new THREE.Mesh(this.maskGeo,this.maskMat);
        this.mask.position.set(0,0,-0.79);
        this.scene.add(this.mask);

        var geometry = new THREE.PlaneGeometry( 0.04,0.04 );






        for ( var i = 0; i < this.screenGeo.vertices.length; i ++ ) {
            var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xffffff,side:THREE.DoubleSide,transparent:true,opacity:1.0 } ) );
            object.position.x = this.screenGeo.vertices[i].x;
            object.position.y = this.screenGeo.vertices[i].y;
            object.position.z = -0.79;
            // object.rotation.x = Math.random() * 2 * Math.PI;
            // object.rotation.y = Math.random() * 2 * Math.PI;
            // object.rotation.z = Math.random() * 2 * Math.PI;
            // object.scale.x = Math.random() * 2 + 1;
            // object.scale.y = Math.random() * 2 + 1;
            // object.scale.z = Math.random() * 2 + 1;
            object.rotation.setFromVector3(new THREE.Vector3(0,0,0));
            object.castShadow = true;
            object.receiveShadow = true;
            object.frustumCulled = false;
            object.name = i.toString();
            this.scene.add( object );
            this.dragableObjs.push( object );
        }

        this.dragableObjs.push(this.mask);
        //
        // var dragControls = new THREE.DragControls( this.dragableObjs, this.camera, this.renderer.domElement );
        // dragControls.addEventListener( 'dragstart', ( event )=> { this.controls.enabled = false; } );
        // dragControls.addEventListener( 'dragend', ( event )=> { this.controls.enabled = true; } );





        this.raycaster = new THREE.Raycaster();

        this.container.appendChild(this.renderer.domElement);
        // this.stats = new Stats();
        // this.container.appendChild( this.stats.domElement );
        document.addEventListener( 'mousemove', this.onMouseMove, false );
        document.addEventListener( 'mousedown', this.onMouseDown, false );
        document.addEventListener( 'mouseup', this.onMouseUp, false );
        document.addEventListener('keydown',this.onKeyDown,false);
        window.addEventListener( 'resize', this.onWindowResize, false );



    }


    public onWindowResize =()=> {
        var aspect = window.innerWidth / window.innerHeight;

        // this.camera.left   = - this.frustumSize * aspect / 2;
        // this.camera.right  =   this.frustumSize * aspect / 2;
        // this.camera.top    =   this.frustumSize / 2;
        // this.camera.bottom = - this.frustumSize / 2;
        // this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }




    // ******************************************************
    public click()
    {

    }

    // ******************************************************
    public keyUp(e:KeyboardEvent)
    {

    }

    // ******************************************************
    public mouseMove(e:MouseEvent)
    {

    }

    // ******************************************************
    public keyDown(e:KeyboardEvent)
    {

    }


    public onKeyDown = (e:KeyboardEvent) => {

        if(e.key == "m")
        {
            for(let i = 0; i < this.dragableObjs.length; i++)
            {
                this.dragableObjs[i].material.opacity = Math.abs(1.0-this.dragableObjs[i].material.opacity);
            }
        }

    }
    public onMouseMove =(e)=>
    {



        var rect = e.target.getBoundingClientRect();

        // スクリーン上のマウス位置を取得する
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        // 取得したスクリーン座標を-1〜1に正規化する（WebGLは-1〜1で座標が表現される）
        mouseX =  (mouseX/window.innerWidth)  * 2 - 1;
        mouseY = -(mouseY/window.innerHeight) * 2 + 1;

        // マウスの位置ベクトル
        var pos = new THREE.Vector3(mouseX, mouseY, 0.1);
        var _pos = new THREE.Vector3(mouseX, mouseY, this.planePosZ);
        pos.unproject(this.camera);
        _pos.unproject(this.camera);
        var ray = new THREE.Raycaster(this.camera.position, pos.sub(this.camera.position).normalize());
        // var _ray = new THREE.Raycaster(this.camera.position, _pos.sub(this.camera.position).normalize());

        // 交差判定
        // 引数は取得対象となるMeshの配列を渡す。以下はシーン内のすべてのオブジェクトを対象に。
        // var objs = ray.intersectObjects(this.dragableObjs, true);
        if (this.raycastedObjs.length > 0) {
            console.log(this.isMouseDown);
            // 交差していたらobjsが1以上になるので、やりたいことをやる。
            this.raycastedObjs[0].object.position.x = pos.x*1.18;
            this.raycastedObjs[0].object.position.y = pos.y*1.2;

            if(this.screenGeo.vertices.length > Number(this.raycastedObjs[0].object.name))
            {
                this.screenGeo.vertices[Number(this.raycastedObjs[0].object.name)].x = pos.x*1.18;
                this.screenGeo.vertices[Number(this.raycastedObjs[0].object.name)].y = pos.y*1.2;

                this.screenGeo.verticesNeedUpdate = true;
            }




        }
    }

    // ******************************************************
    public onMouseDown =(e)=>
    {


        var rect = e.target.getBoundingClientRect();

        // スクリーン上のマウス位置を取得する
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        // 取得したスクリーン座標を-1〜1に正規化する（WebGLは-1〜1で座標が表現される）
        mouseX =  (mouseX/window.innerWidth)  * 2 - 1;
        mouseY = -(mouseY/window.innerHeight) * 2 + 1;

        // マウスの位置ベクトル
        var pos = new THREE.Vector3(mouseX, mouseY, 1);
        var _pos = new THREE.Vector3(mouseX, mouseY, this.planePosZ);

        // pos はスクリーン座標系なので、オブジェクトの座標系に変換
        // オブジェクト座標系は今表示しているカメラからの視点なので、第二引数にカメラオブジェクトを渡す
        // new THREE.Projector.unprojectVector(pos, camera); ↓最新版では以下の方法で得る
        pos.unproject(this.camera);
        _pos.unproject(this.camera);

        // 始点、向きベクトルを渡してレイを作成
        var ray = new THREE.Raycaster(this.camera.position, pos.sub(this.camera.position).normalize());

        // 交差判定
        // 引数は取得対象となるMeshの配列を渡す。以下はシーン内のすべてのオブジェクトを対象に。
        this.raycastedObjs = ray.intersectObjects(this.dragableObjs);

        //ヒエラルキーを持った子要素も対象とする場合は第二引数にtrueを指定する
        //var objs = ray.intersectObjects(scene.children, true);



    }

    public onMouseUp =(e:MouseEvent)=>
    {
        this.raycastedObjs = [];
        this.isMouseDown = false;
    }


    public animate =()=> {
        requestAnimationFrame( this.animate );
        this.render();
        // this.stats.update();
    }

    // ******************************************************
    public render()
    {


        // this.screenMat.map = this.rendertarget.texture;

        this.scene01.update();

        // this.controls.update();
        this.renderer.render( this.scene01.scene, this.scene01.camera ,this.rendertarget);
        this.renderer.render( this.scene, this.camera );

    }



}
