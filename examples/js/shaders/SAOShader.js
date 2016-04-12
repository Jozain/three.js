/**
 * @author bhouston / http://clara.io/
 *
 * Scalable Ambient Occlusion
 *
 */

THREE.SAOShader = {

	defines: {
    'NUM_SAMPLES': 64,
    'NUM_RINGS': 7,
		'AO_ONLY': 0
  },

	uniforms: {

		"tDiffuse":     { type: "t", value: null },
		"tDepth":       { type: "t", value: null },
		"size":         { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"cameraNear":   { type: "f", value: 1 },
		"cameraFar":    { type: "f", value: 100 },
		"scale":   { type: "f", value: 10 },
    "intensity":   { type: "f", value: 60.0 },
    "bias":   { type: "f", value: 0.0 },
		"sampleRadiusPixels":   { type: "f", value: 35.0 },
		"cameraProjectionMatrix": { type: "m4", value: new THREE.Matrix4() },
		"cameraInverseProjectionMatrix": { type: "m4", value: new THREE.Matrix4() },
		"randomSeed": { type: "f", value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		// total number of samples at each fragment",
	  "#extension GL_OES_standard_derivatives : enable",

		"#include <common>",

	  "#define MIN_RESOLUTION      0.0001",

	  "varying vec2 vUv;",

	  "uniform sampler2D tDepth;",
	  "uniform sampler2D tDiffuse;",

	  "uniform mat4 cameraInverseProjectionMatrix;",
	  "uniform mat4 cameraProjectionMatrix;",

	  "uniform float scale;",
	  "uniform float intensity;",
	  "uniform float bias;",
	  "uniform float sampleRadiusPixels;",
	  "uniform float cameraNear;",
	  "uniform float cameraFar;",
	  "uniform vec2 size;",
		"uniform float randomSeed;",

		// RGBA depth

		"#include <packing>",
		"#include <procedural>",

		"vec3 getViewSpacePosition( vec2 screenSpacePosition ) {",
		"   float perspectiveDepth = unpackRGBAToLinearUnit( texture2D( tDepth, screenSpacePosition ) );",
		"   float viewSpaceZ = perspectiveDepthToViewZ( perspectiveDepth, cameraNear, cameraFar );",
		"   float w = cameraProjectionMatrix[2][3] * viewSpaceZ + cameraProjectionMatrix[3][3];",
		"   vec3 clipPos = ( vec3( screenSpacePosition, perspectiveDepth ) - 0.5 ) * 2.0;",
		"   return ( cameraInverseProjectionMatrix * vec4( w * clipPos.xyz, w ) ).xyz;",
		"}",

		"vec3 getViewSpaceNormalFromDepth(vec3 viewSpacePosition ) {",
		"    return normalize( cross( dFdx( viewSpacePosition ), dFdy( viewSpacePosition ) ) );",
		"}",

	 "float getOcclusion( vec3 viewSpacePosition, vec3 viewSpaceNormal, vec3 viewSpacePositionOffset ) {",
			"vec3 viewSpaceDelta = viewSpacePositionOffset - viewSpacePosition;",
			"float viewSpaceDistance = length( viewSpaceDelta );",
			"float distance = scale * viewSpaceDistance / cameraFar;",
			"return intensity * max(0.0, (dot(viewSpaceNormal, viewSpaceDelta) - MIN_RESOLUTION * cameraFar) / viewSpaceDistance - bias) / (1.0 + pow2( viewSpaceDistance ) );",
		"}",


	"float basicPattern( vec3 viewSpacePosition ) {",

		"vec3 viewSpaceNormal = getViewSpaceNormalFromDepth( viewSpacePosition );",

		"float random = noiseRandom1D( vUv + randomSeed );",

		"vec2 radius = vec2( sampleRadiusPixels ) / size;",
		"float numSamples = float( NUM_SAMPLES );",
		"float numRings = float( NUM_RINGS );",
		"float alphaStep = 1.0 / numSamples;",

		// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/

		"float occlusionSum = 0.0;",
		"float alpha = 0.0;",
		"float weight = 0.0;",

		"for( int i = 0; i < NUM_SAMPLES; i ++ ) {",
			"float angle = PI2 * ( numRings * alpha + random );",
			"vec2 currentRadius = radius * ( 0.1 + alpha * 0.9 );",
			"vec2 offset = vec2( cos(angle), sin(angle) ) * currentRadius;",
			"alpha += alphaStep;",

			"vec3 viewSpacePositionOffset = getViewSpacePosition( vUv + offset );",
			"if( -viewSpacePositionOffset.z >= cameraFar ) {",
				"continue;",
			"}",
			"occlusionSum += getOcclusion( viewSpacePosition, viewSpaceNormal, viewSpacePositionOffset );",
			"weight += 1.0;",
		"}",
		"if( weight == 0.0 ) return 0.0;",
		"return occlusionSum / weight;",
	"}",


	"void main() {",

  	"vec4 color = texture2D( tDiffuse, vUv );",
  	"vec3 viewSpacePosition = getViewSpacePosition( vUv );",

  	"if( -viewSpacePosition.z >= cameraFar ) {",
  		"gl_FragColor = color;",
  		"return;",
  	"}",

		"float occlusion = 1.0 - basicPattern( viewSpacePosition );",

		"vec4 result = vec4( occlusion, 1.0 );",

		"#if ( AO_ONLY == 0 )",
		  "result.xyz *= color.xyz;",
		"#endif",

		"gl_FragColor = result;",
	"}"

	].join( "\n" )

};
