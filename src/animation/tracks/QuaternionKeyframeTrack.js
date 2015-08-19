/**
 *
 * A Track that interpolates Quaternion
 * 
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.QuaternionKeyframeTrack = function ( name, keys ) {

	THREE.KeyframeTrack.call( this, name, keys );

	// local cache of value type to avoid allocations during runtime.
	this.result = this.keys[0].value.clone();

};
 
THREE.QuaternionKeyframeTrack.prototype = Object.create( THREE.KeyframeTrack.prototype );

THREE.QuaternionKeyframeTrack.prototype.constructor = THREE.QuaternionKeyframeTrack;

THREE.QuaternionKeyframeTrack.prototype.setResult = function( value ) {

	this.result.copy( value );

};

// memoization of the lerp function for speed.
// NOTE: Do not optimize as a prototype initialization closure, as value0 will be different on a per class basis.
THREE.QuaternionKeyframeTrack.prototype.lerpValues = function( value0, value1, alpha ) {

	return value0.slerp( value1, alpha );

};

THREE.QuaternionKeyframeTrack.prototype.compareValues = function( value0, value1 ) {

	return value0.equals( value1 );

};