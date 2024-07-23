import {
  BufferBinding,
  VEC_Y,
  VEC_Z,
  Vec,
  addVec,
  scale,
  xyzArray,
} from "@grinstead/ambush";
import {
  IDENTITY,
  MatrixBinary,
  rotateAboutX,
  rotateAboutY,
} from "./Matrix.ts";
import { createMemo } from "solid-js";

export type MarbleCameraProps = {
  marbleRadius: number;
  worldMatrix: Float32Array;
  marble: Vec;
  offset: Vec;
};

export function MarbleCamera(props: MarbleCameraProps) {
  const binary = new MatrixBinary();
  const matrix = createMemo(() => {
    const { marbleRadius, offset } = props;

    binary.set(IDENTITY);
    rotateAboutX(binary, offset.y);
    rotateAboutY(binary, offset.x);
    binary.leftMultiply(props.worldMatrix);

    const mat = binary.snapshot();

    const distance = marbleRadius * offset.z;

    let pos = props.marble;
    pos = addVec(pos, scale(binary.multVec(VEC_Z), distance));
    pos = addVec(pos, scale(binary.multVec(VEC_Y), distance * 0.1));

    // set the translation col to xyz position
    mat.set(xyzArray(pos), 12);

    return mat;
  });

  return <FreeCamera matrix={matrix()} />;
}

export function OrbitCamera(props: { target: Vec; offset: Vec }) {
  return (
    <MarbleCamera
      marble={props.target}
      offset={props.offset}
      worldMatrix={IDENTITY}
      marbleRadius={0}
    />
  );
}

export function FreeCamera(props: { matrix: Float32Array }) {
  return <BufferBinding label="iMat" group={0} id={0} value={props.matrix} />;
}
