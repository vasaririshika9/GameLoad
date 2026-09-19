from typing import List, Dict, Any

GAMES_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "cyber-sprint-x",
        "title": "Cyber Sprint X",
        "subtitle": "High-octane neon synthwave highway racing",
        "category": "Racing",
        "rating": 4.9,
        "playable": True,
        "playable_engine": "cyber_sprint",
        "bundle_size_mb": 135,
        "uncompressed_size_mb": 420,
        "cold_load_sec": 6.8,
        "optimized_load_ms": 460,
        "thumbnail": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#00f3ff",
        "gradient": "from-cyan-500 to-blue-600",
        "description": "Certified third-party WebAssembly 3D neon racing bundle. Experience supersonic speed on infinite cyberpunk highways with dynamic traffic and hyper-boost mechanics.",
        "assets": [
            {"id": "csx_engine_wasm", "name": "WASM Engine Core (v2.4)", "type": "wasm", "size_mb": 42, "importance": 3.0, "required": True},
            {"id": "csx_synth_tracks", "name": "Synthwave Audio Banks (FLAC)", "type": "audio", "size_mb": 28, "importance": 2.2, "required": False},
            {"id": "csx_neon_textures", "name": "4K Neon PBR Atlases", "type": "textures", "size_mb": 45, "importance": 2.5, "required": True},
            {"id": "csx_cyber_models", "name": "Hover-Rig Meshes (LOD 0)", "type": "models", "size_mb": 20, "importance": 1.8, "required": False}
        ]
    },
    {
        "id": "neon-striker-pro",
        "title": "Neon Striker Pro",
        "subtitle": "Futuristic precision football shootout arena",
        "category": "Sports",
        "rating": 4.8,
        "playable": True,
        "playable_engine": "neon_striker",
        "bundle_size_mb": 160,
        "uncompressed_size_mb": 510,
        "cold_load_sec": 7.2,
        "optimized_load_ms": 485,
        "thumbnail": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#10b981",
        "gradient": "from-emerald-500 to-teal-600",
        "description": "Dynamic zero-gravity penalty shootout championship. Calculate curvature, power vectors, and target kinetic shields in real-time.",
        "assets": [
            {"id": "nsp_physics_wasm", "name": "PhysX Rigid-Body Solver", "type": "wasm", "size_mb": 48, "importance": 3.0, "required": True},
            {"id": "nsp_stadium_geo", "name": "Holographic Arena Meshes", "type": "models", "size_mb": 52, "importance": 2.2, "required": True},
            {"id": "nsp_fx_particles", "name": "Kinetic Particle Shaders", "type": "shaders", "size_mb": 35, "importance": 2.0, "required": False},
            {"id": "nsp_crowd_audio", "name": "Spatial Stadium Cheer Ambience", "type": "audio", "size_mb": 25, "importance": 1.4, "required": False}
        ]
    },
    {
        "id": "starvoid-arcade",
        "title": "StarVoid Arcade",
        "subtitle": "Bullet-hell cosmic interceptor arcade survival",
        "category": "Arcade",
        "rating": 4.7,
        "playable": True,
        "playable_engine": "starvoid",
        "bundle_size_mb": 85,
        "uncompressed_size_mb": 240,
        "cold_load_sec": 5.4,
        "optimized_load_ms": 410,
        "thumbnail": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#a855f7",
        "gradient": "from-purple-500 to-indigo-600",
        "description": "Defend the outer perimeter against rogue drone swarms. Upgrade plasma cannons, trigger EMP shockwaves, and survive relentless boss waves.",
        "assets": [
            {"id": "sva_runtime", "name": "Arcade WebGL Runtime", "type": "wasm", "size_mb": 25, "importance": 3.0, "required": True},
            {"id": "sva_sprites", "name": "Vector Enemy Sprite Sheets", "type": "textures", "size_mb": 32, "importance": 2.5, "required": True},
            {"id": "sva_sfx", "name": "Chiptune FM Synthesizer Soundbank", "type": "audio", "size_mb": 16, "importance": 1.8, "required": False},
            {"id": "sva_levels", "name": "Procedural Wave Matrix Data", "type": "data", "size_mb": 12, "importance": 2.1, "required": True}
        ]
    },
    {
        "id": "quantum-shift",
        "title": "Quantum Shift",
        "subtitle": "Mind-bending multidimensional color match",
        "category": "Puzzle",
        "rating": 4.6,
        "playable": True,
        "playable_engine": "quantum_shift",
        "bundle_size_mb": 65,
        "uncompressed_size_mb": 180,
        "cold_load_sec": 4.8,
        "optimized_load_ms": 380,
        "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#ec4899",
        "gradient": "from-pink-500 to-rose-600",
        "description": "Align chromatic quantum crystals across shifting gravity planes. Fast-paced puzzle gameplay with combo multipliers and chain reactions.",
        "assets": [
            {"id": "qs_logic_wasm", "name": "Quantum Grid State Engine", "type": "wasm", "size_mb": 18, "importance": 3.0, "required": True},
            {"id": "qs_crystal_fx", "name": "Refractive Crystal Shaders", "type": "shaders", "size_mb": 24, "importance": 2.4, "required": True},
            {"id": "qs_ambient_audio", "name": "Generative Binaural Soundscape", "type": "audio", "size_mb": 23, "importance": 1.5, "required": False}
        ]
    },
    {
        "id": "apex-velocity",
        "title": "Apex Velocity",
        "subtitle": "Next-gen hypercar street racing simulator",
        "category": "Racing",
        "rating": 4.9,
        "playable": False,
        "playable_engine": "simulation_only",
        "bundle_size_mb": 210,
        "uncompressed_size_mb": 680,
        "cold_load_sec": 7.9,
        "optimized_load_ms": 520,
        "thumbnail": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#f59e0b",
        "gradient": "from-amber-500 to-orange-600",
        "description": "High-fidelity vehicle aerodynamics simulation with realistic tire deformation and raytraced reflections. Heavyweight bundle ideal for demonstrating Knapsack prioritization.",
        "assets": [
            {"id": "av_aero_wasm", "name": "Aerodynamics Physics Core", "type": "wasm", "size_mb": 65, "importance": 3.0, "required": True},
            {"id": "av_car_models", "name": "LOD0 Hypercar Body Meshes", "type": "models", "size_mb": 85, "importance": 2.6, "required": True},
            {"id": "av_city_textures", "name": "Urban Asphalt & Decal Atlases", "type": "textures", "size_mb": 60, "importance": 2.0, "required": False}
        ]
    },
    {
        "id": "cyber-odyssey",
        "title": "Cyber Odyssey",
        "subtitle": "Expansive open-world cybernetic adventure",
        "category": "Action",
        "rating": 4.8,
        "playable": False,
        "playable_engine": "simulation_only",
        "bundle_size_mb": 280,
        "uncompressed_size_mb": 890,
        "cold_load_sec": 8.6,
        "optimized_load_ms": 560,
        "thumbnail": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        "theme_color": "#3b82f6",
        "gradient": "from-blue-600 to-indigo-700",
        "description": "Certified AAA web RPG bundle. Massive 280 MB resource footprint demonstrating how GameLoad AI delivers sub-600ms launches even for huge games.",
        "assets": [
            {"id": "co_world_mesh", "name": "Neo-Tokyo Megacity Sector 4 Mesh", "type": "models", "size_mb": 110, "importance": 2.8, "required": True},
            {"id": "co_anim_wasm", "name": "Inverse Kinematics Skeletal Solver", "type": "wasm", "size_mb": 75, "importance": 3.0, "required": True},
            {"id": "co_cutscene_audio", "name": "Cinematic Dialogue & Score FLAC", "type": "audio", "size_mb": 55, "importance": 1.6, "required": False},
            {"id": "co_vfx_pack", "name": "Volumetric Neon Fog Shaders", "type": "shaders", "size_mb": 40, "importance": 1.9, "required": False}
        ]
    }
]
