(function() {
// refer to https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/DeviceOrientationControls.js
AutodeskNamespace('Autodesk.Viewing.Extensions.GamepadModule');

Autodesk.Viewing.Extensions.GamepadModule = function(viewer) {
    const zee = new THREE.Vector3(0, 0, 1);
    const deg = THREE.Math.degToRad;
    let doe = null;
    let qe = new THREE.Quaternion();
    let q0 = new THREE.Quaternion();
    let q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis
    let quaternion = new THREE.Quaternion();
    let euler = new THREE.Euler();
    var m1 = new THREE.Matrix4();
    this.orient = 0;

    window.addEventListener('orientationchange', e => this.orient = deg(window.orientation), false);
    window.addEventListener('deviceorientation', e => this.deviceOrientation = e );

    this.update = function(camera) {
        if (!this.deviceOrientation) return camera;

        doe = this.deviceOrientation;
        euler.set(deg(doe.beta), deg(doe.alpha), -deg(doe.gamma), 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
        qe.setFromEuler(euler); // orient the device

        quaternion.set(Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); //  PI/2 around the x-axis
        quaternion.multiply(qe); // orient the device
        quaternion.multiply(q1); // camera looks out the back of the device, not the top
        quaternion.multiply(q0.setFromAxisAngle(zee, -this.orient)); // adjust for screen orientation
        m1.makeRotationFromQuaternion(quaternion);
        camera.setRotationFromMatrix(m1);

        // adjust camera target
        var lookAtDir = new THREE.Vector3(0, 0, -1);
        lookAtDir.applyQuaternion(camera.quaternion);
        camera.target = camera.position.clone().add(lookAtDir.clone().multiplyScalar(10));

        viewer.impl.invalidate(true, true, true);
        return camera;
    }

    this.activate = function(toolName) {};

    this.deactivate = function() {};
};
})();