import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { useStore } from '../hooks/useStore.js'

const CHARACTER_SPEED = 4
const CHARACTER_JUMP_FORCE = 4

export const Player = () => {
  const {
    moveBackward,
    moveForward,
    moveLeft,
    moveRight,
    jump
  } = useKeyboard()

  const [updatePlayerPosition] = useStore(state => [state.updatePlayerPosition])

  const { camera } = useThree()
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 0] // Posición inicial más alta para el mundo procedural
  }))

  const pos = useRef([0, 0, 0])
  useEffect(() => {
    api.position.subscribe(p => {
      pos.current = p
    })
  }, [api.position])

  const vel = useRef([0, 0, 0])
  useEffect(() => {
    api.velocity.subscribe(p => {
      vel.current = p
    })
  }, [api.velocity])

  useFrame(() => {
    camera.position.copy(
      new Vector3(
        pos.current[0], // x
        pos.current[1], // y
        pos.current[2] // z
      )
    )

    // Actualizar posición del jugador en el store para el mundo procedural
    updatePlayerPosition(pos.current)

    const direction = new Vector3()

    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    )

    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    )

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(CHARACTER_SPEED) // walk: 2, run: 5
      .applyEuler(camera.rotation)

    api.velocity.set(
      direction.x,
      vel.current[1], // ???? saltar.
      direction.z
    )

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(
        vel.current[0],
        CHARACTER_JUMP_FORCE,
        vel.current[2]
      )
    }
  })

  return (
    <mesh ref={ref} />
  )
}
