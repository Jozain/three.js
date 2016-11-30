/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FilmPass = function ( noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale ) {

	THREE.Pass.call( this );

	if ( THREE.FilmShader === undefined )
		console.error( "THREE.FilmPass relies on THREE.FilmShader" );

	var shader = THREE.FilmShader;

	this.uniforms = Object.assign( {}, shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.uniforms[ "tDiffuse" ] = new THREE.Uniform();
	this.uniforms[ "time" ] = new THREE.Uniform( 0 );

	if ( grayscale !== undefined )	this.uniforms.grayscale = new THREE.Uniform( grayscale );
	if ( noiseIntensity !== undefined ) this.uniforms.nIntensity = new THREE.Uniform( noiseIntensity );
	if ( scanlinesIntensity !== undefined ) this.uniforms.sIntensity = new THREE.Uniform( scanlinesIntensity );
	if ( scanlinesCount !== undefined ) this.uniforms.sCount = new THREE.Uniform( scanlinesCount );

};

THREE.FilmPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.FilmPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.uniforms[ "time" ].value += delta;

		if ( this.renderToScreen ) {

			renderer.renderPass( this.material );

		} else {

			renderer.renderPass( this.material, writeBuffer, this.clear );

		}

	}

} );
