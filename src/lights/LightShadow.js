import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { _Math } from '../math/Math';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 */

function LightShadow( camera ) {

	this.camera = camera;

	this.bias = 0;
	this.radius = 1;

	this.mapSize = new Vector2( 512, 512 );

	this.map = null;
	this.matrix = new Matrix4();

	this.cameraFovNearFar = new Vector3( 2 * _Math.DEG2RAD, 0.5, 500 );

};

Object.assign( LightShadow.prototype, {

	copy: function ( source ) {

		this.camera = source.camera.clone();

		this.bias = source.bias;
		this.radius = source.radius;

		this.mapSize.copy( source.mapSize );

		this.cameraFovNearFar.copy( source.cameraFovNearFar );

		return this;

	},



	clone: function () {

		return new this.constructor().copy( this );

	},

	toJSON: function () {

		var object = {};

		if ( this.bias !== 0 ) object.bias = this.bias;
		if ( this.radius !== 1 ) object.radius = this.radius;
		if ( this.mapSize.x !== 512 || this.mapSize.y !== 512 ) object.mapSize = this.mapSize.toArray();

		object.camera = this.camera.toJSON( false ).object;
		delete object.camera.matrix;

		return object;

	}

} );


export { LightShadow };
