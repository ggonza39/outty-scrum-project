"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

type MatchCardProps = {
  person: {
    id: string;
    name: string;
    age: number;
    image: string;
    bio?: string;
  };
  onLike: (id: string) => void;
  onPass: (id: string) => void;
};

const SWIPE_THRESHOLD = 120;

export default function MatchCard({
  person,
  onLike,
  onPass,
}: MatchCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [0, 40, 100], [0, 0.65, 1]);
  const passOpacity = useTransform(x, [-100, -40, 0], [1, 0.65, 0]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offsetX = info.offset.x;

    if (offsetX > SWIPE_THRESHOLD) {
      onLike(person.id);
    } else if (offsetX < -SWIPE_THRESHOLD) {
      onPass(person.id);
    }
  };

  return (
    <motion.div
      drag="x"
      style={{ x, rotate, width: "100%", maxWidth: 320 }}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      className="touch-pan-y"
    >
      <div
        className="card"
        style={{
          padding: 0,
          overflow: "hidden",
          position: "relative",
          borderRadius: 24,
        }}
      >
        <motion.div
          style={{ opacity: passOpacity }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 3,
              border: "4px solid #e11d48",
              color: "#e11d48",
              background: "rgba(255,255,255,0.92)",
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: "1rem",
              fontWeight: 800,
            }}
          >
            PASS
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: likeOpacity }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 3,
              border: "4px solid #16a34a",
              color: "#16a34a",
              background: "rgba(255,255,255,0.92)",
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: "1rem",
              fontWeight: 800,
            }}
          >
            LIKE
          </div>
        </motion.div>

        <div
          style={{
            width: "100%",
            height: 420,
            background: "#e9eef3",
            position: "relative",
          }}
        >
          <img
            src={person.image}
            alt={person.name}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            padding: 16,
            color: "white",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.35), rgba(0,0,0,0))",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: 800 }}>
            {person.name}, {person.age}
          </h2>

          {person.bio ? (
            <p style={{ margin: "8px 0 0", fontSize: "1rem", lineHeight: 1.4 }}>
              {person.bio}
            </p>
          ) : null}

          <p
            style={{
              margin: "12px 0 0",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
          </p>
        </div>
      </div>
    </motion.div>
  );
}