"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export function ImportedShirtModel({
  modelPath,
  color,
  frontTexture,
  leftTexture,
  backTexture,
  sleeveTexture,
}: {
  modelPath: string;
  color: string;
  frontTexture: THREE.Texture | null;
  leftTexture: THREE.Texture | null;
  backTexture: THREE.Texture | null;
  sleeveTexture: THREE.Texture | null;
}) {
  const { scene } = useGLTF(modelPath);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      child.castShadow = true;
      child.receiveShadow = true;

      child.material = Array.isArray(child.material)
        ? child.material.map((material) => tintMaterial(material, color))
        : tintMaterial(child.material, color);
    });

    return clone;
  }, [color, scene]);

  return (
    <group>
      <primitive object={clonedScene} scale={1.8} position={[0, -1.15, 0]} />
      <DesignPlane texture={frontTexture} position={[0, 0.18, 0.48]} scale={[0.9, 0.9, 0.9]} />
      <DesignPlane texture={leftTexture} position={[-0.42, 0.42, 0.48]} scale={[0.42, 0.42, 0.42]} />
      <DesignPlane texture={backTexture} position={[0, 0.2, -0.48]} scale={[0.96, 0.96, 0.96]} rotation={[0, Math.PI, 0]} />
      <DesignPlane texture={sleeveTexture} position={[1.08, 0.12, 0]} scale={[0.38, 0.38, 0.38]} rotation={[0, -Math.PI / 2, 0]} />
      <DesignPlane texture={sleeveTexture} position={[-1.08, 0.12, 0]} scale={[0.38, 0.38, 0.38]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function tintMaterial(material: THREE.Material, color: string) {
  if (!("color" in material)) {
    return material;
  }

  const clonedMaterial = material.clone() as THREE.MeshStandardMaterial;
  clonedMaterial.color = new THREE.Color(color);
  clonedMaterial.roughness = Math.max(clonedMaterial.roughness ?? 0.75, 0.72);
  clonedMaterial.metalness = Math.min(clonedMaterial.metalness ?? 0.05, 0.08);
  return clonedMaterial;
}

function DesignPlane({
  texture,
  position,
  rotation = [0, 0, 0],
  scale,
}: {
  texture: THREE.Texture | null;
  position: THREE.Vector3Tuple;
  rotation?: THREE.EulerTuple;
  scale: THREE.Vector3Tuple;
}) {
  if (!texture) {
    return null;
  }

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent map={texture} alphaTest={0.02} />
    </mesh>
  );
}
