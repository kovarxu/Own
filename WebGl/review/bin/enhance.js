// enhance some addition functions

// flattenedPrimitives, set random colors in bufferinfo
(function() {
  "use strict";
  // random color functions
  const randFns = {
    default: (function() {
      let last;
      return function(ndx, channel) {
        if (channel === 0) {
          last = 128 + Math.random() * 128 | 0;
        }
        return channel < 3 ? last : 255;
      }
    })(),
    complete_random: function(ndx, channel) {
      let rand_color = Math.random() * 256 | 0
      return channel < 3 ? rand_color : 255;
    }
  }

  let currentRandFnType = 'default'
  twgl.setRandColorFn = function setRandColorFn (type) {
    currentRandFnType = randFns[type] ? type : 'default'
  }

  // this function takes a set of indexed vertices
  // It deindexed them. It then adds random vertex
  // colors to each triangle. Finally it passes
  // the result to createBufferInfoFromArrays and
  // returns a twgl.BufferInfo
  function createFlattenedVertices(gl, vertices, vertsPerColor, controlOnVertices) {
    let last;
    if (typeof controlOnVertices === 'function') {
      vertices = controlOnVertices(gl, vertices)
    }
    return twgl.createBufferInfoFromArrays(
        gl,
        twgl.primitives.makeRandomVertexColors(
            twgl.primitives.deindexVertices(vertices),
            {
              vertsPerColor: vertsPerColor || 1,
              rand: randFns[currentRandFnType]
            }
        )
      );
  }

  twgl.createFlattenedVertices = createFlattenedVertices

  function createFlattenedFunc(createVerticesFunc, vertsPerColor) {
    return function(gl) {
      const arrays = createVerticesFunc.apply(null,  Array.prototype.slice.call(arguments, 1));
      return createFlattenedVertices(gl, arrays, vertsPerColor);
    };
  }

  // These functions make primitives with semi-random vertex colors.
  // This means the primitives can be displayed without needing lighting
  // which is important to keep the samples simple.

  window.flattenedPrimitives = {
    "create3DFBufferInfo": createFlattenedFunc(twgl.primitives.create3DFVertices, 6),
    "createCubeBufferInfo": createFlattenedFunc(twgl.primitives.createCubeVertices, 6),
    "createPlaneBufferInfo": createFlattenedFunc(twgl.primitives.createPlaneVertices, 6),
    "createSphereBufferInfo": createFlattenedFunc(twgl.primitives.createSphereVertices, 6),
    "createTruncatedConeBufferInfo": createFlattenedFunc(twgl.primitives.createTruncatedConeVertices, 6),
    "createXYQuadBufferInfo": createFlattenedFunc(twgl.primitives.createXYQuadVertices, 6),
    "createCresentBufferInfo": createFlattenedFunc(twgl.primitives.createCresentVertices, 6),
    "createCylinderBufferInfo": createFlattenedFunc(twgl.primitives.createCylinderVertices, 6),
    "createTorusBufferInfo": createFlattenedFunc(twgl.primitives.createTorusVertices, 6),
    "createDiscBufferInfo": createFlattenedFunc(twgl.primitives.createDiscVertices, 4),
  };

}());

// class node, some scene animation

class Node {
  constructor () {
    this.worldMatrix = m4unit();
    this.localMatrix = m4unit();
    this.children = [];
    this.parent = null;
  }

  setParent (parent) {
    let previousParent = this.parent;
    if (previousParent) {
      previousParent._removeChild(this);
      this.parent = null;
    }
    parent._addChild(this);
    this.parent = parent;
  }

  _addChild (child) {
    if (this.children.indexOf(child) < 0) {
      this.children.push(child);
    }
  }

  _removeChild (child) {
    let id = this.children.indexOf(child);
    if (id >= 0) {
      this.children.splice(id, 1);
    }
  }

  // calculate worldMatrix by wm = ... * grandparent * parent * local
  calcWorldMatrix () {
    if (this.parent) {
      this.worldMatrix = m4mul(this.localMatrix, this.parent.worldMatrix);
    } else {
      // the root node
      this.worldMatrix = m4mul(m4unit(), this.localMatrix);
    }
  }

  // sync matrix info of all levels
  updateWorldMatrixInfo () {
    this.calcWorldMatrix();
    this.children.forEach((child) => {
      child.updateWorldMatrixInfo();
    })
  }

  setLocalMatrix (mat) {
    if (mat && mat.length === 16) {
      this.localMatrix = mat;
    } else {
      console.warn('The mat parameter should be an array, the size of which is 16.');
    }
  }
}
