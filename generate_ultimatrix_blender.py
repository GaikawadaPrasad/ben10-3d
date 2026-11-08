"""
=============================================================================
  PRO BEN 10 ULTIMATRIX GAUNTLET 3D MODEL GENERATOR (Blender bpy)
  High-Fidelity Prop / Wearable Cosplay / 3D Print Ready
=============================================================================
"""

import bpy
import bmesh
import math
import os

def clean_scene():
    """Removes all previous objects (including Blender's default Cube/Light/Camera)."""
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
        
    for col_name in ["Ultimatrix_Gauntlet", "Omnitrix_Model", "Collection"]:
        if col_name in bpy.data.collections:
            col = bpy.data.collections[col_name]
            bpy.data.collections.remove(col)
            
    # Purge orphan data
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)

def create_collection(name="Ultimatrix_Gauntlet"):
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col

# -------------------------------------------------------------------------
# Material Creation with Viewport & Shader Node Support
# -------------------------------------------------------------------------
def create_mat(name, base_rgb, metallic=0.0, roughness=0.3, emission_rgb=None, emission_strength=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
    mat.use_nodes = True
    
    # Crucial for Solid Viewport Mode:
    mat.diffuse_color = (base_rgb[0], base_rgb[1], base_rgb[2], 1.0)
    mat.roughness = roughness
    mat.metallic = metallic
    
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    out = nodes.new(type='ShaderNodeOutputMaterial')
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    mat.node_tree.links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    
    if "Base Color" in bsdf.inputs:
        bsdf.inputs["Base Color"].default_value = (base_rgb[0], base_rgb[1], base_rgb[2], 1.0)
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = roughness
        
    if emission_rgb:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (emission_rgb[0], emission_rgb[1], emission_rgb[2], 1.0)
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (emission_rgb[0], emission_rgb[1], emission_rgb[2], 1.0)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission_strength
            
    return mat

def apply_mat(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

def add_bevel_and_smooth(obj, width=0.012, segments=2):
    bpy.context.view_layer.objects.active = obj
    for p in obj.data.polygons:
        p.use_smooth = True
    bevel = obj.modifiers.new(name="Bevel", type='BEVEL')
    bevel.width = width
    bevel.segments = segments
    bevel.limit_method = 'ANGLE'

# -------------------------------------------------------------------------
# Core Geometry Construction
# -------------------------------------------------------------------------
def build_pro_ultimatrix():
    clean_scene()
    col = create_collection("Ultimatrix_Gauntlet")

    # 1. PBR Materials with vibrant Solid-Mode Viewport Colors
    mat_carbon_dark  = create_mat("Ult_DarkCarbon",  (0.11, 0.12, 0.13), metallic=0.25, roughness=0.35)
    mat_galvan_green = create_mat("Ult_GalvanGreen", (0.05, 0.58, 0.16), metallic=0.15, roughness=0.25)
    mat_chrome_trim  = create_mat("Ult_ChromeSilver",(0.78, 0.80, 0.84), metallic=0.90, roughness=0.15)
    mat_dial_core    = create_mat("Ult_ObsidianBlack",(0.02, 0.02, 0.02), metallic=0.10, roughness=0.08)
    mat_omni_glow    = create_mat("Ult_OmniGlow",    (0.15, 1.00, 0.25), metallic=0.0, roughness=0.1,
                                  emission_rgb=(0.12, 1.0, 0.22), emission_strength=18.0)
    mat_glass        = create_mat("Ult_DialGlass",   (0.9, 0.95, 1.0),   metallic=0.1, roughness=0.02)

    created_objects = []

    # ---------------------------------------------------------------------
    # 2. Anatomical Forearm Gauntlet Chassis (Wearable Vambrace)
    # ---------------------------------------------------------------------
    # Forearm extends from Y = -2.4 (elbow) to Y = +1.8 (wrist)
    # Cross-sections: Anatomically elliptical (flattened bottom, wider laterally)
    arm_mesh = bpy.data.meshes.new("Mesh_GauntletVambrace")
    arm_obj = bpy.data.objects.new("Ultimatrix_Vambrace", arm_mesh)
    col.objects.link(arm_obj)
    
    bm = bmesh.new()
    
    slices = [
        # (y_position, radius_x, radius_z, bottom_flatten_factor)
        (-2.4, 1.40, 1.15, 0.82), # Elbow joint (wide)
        (-1.4, 1.32, 1.08, 0.84),
        (-0.2, 1.22, 1.00, 0.86), # Dial mount region
        (1.0,  1.08, 0.88, 0.88),
        (1.8,  0.96, 0.78, 0.90), # Wrist joint (tapered)
    ]
    
    outer_rings = []
    inner_rings = []
    num_pts = 36
    wall_thickness = 0.12
    
    for y_pos, rx, rz, flat in slices:
        out_ring = []
        in_ring = []
        for i in range(num_pts):
            th = (2.0 * math.pi * i) / num_pts
            # Outer profile
            ox = rx * math.cos(th)
            oz = rz * math.sin(th)
            if oz < 0:
                oz *= flat
            v_out = bm.verts.new((ox, y_pos, oz))
            out_ring.append(v_out)
            
            # Inner hollow canal (so gauntlet is hollow and wearable)
            ix = (rx - wall_thickness) * math.cos(th)
            iz = (rz - wall_thickness) * math.sin(th)
            if iz < 0:
                iz *= flat
            v_in = bm.verts.new((ix, y_pos, iz))
            in_ring.append(v_in)
            
        outer_rings.append(out_ring)
        inner_rings.append(in_ring)
        
    # Bridge outer surface
    for r in range(len(outer_rings) - 1):
        r1, r2 = outer_rings[r], outer_rings[r + 1]
        for i in range(num_pts):
            ni = (i + 1) % num_pts
            bm.faces.new([r1[i], r2[i], r2[ni], r1[ni]])
            
    # Bridge inner hollow canal
    for r in range(len(inner_rings) - 1):
        r1, r2 = inner_rings[r], inner_rings[r + 1]
        for i in range(num_pts):
            ni = (i + 1) % num_pts
            bm.faces.new([r1[ni], r2[ni], r2[i], r1[i]])
            
    # Cap wrist and elbow rim rims
    for r_out, r_in in [(outer_rings[0], inner_rings[0]), (outer_rings[-1], inner_rings[-1])]:
        for i in range(num_pts):
            ni = (i + 1) % num_pts
            if r_out == outer_rings[0]:
                bm.faces.new([r_out[i], r_out[ni], r_in[ni], r_in[i]])
            else:
                bm.faces.new([r_out[ni], r_out[i], r_in[i], r_in[ni]])
                
    bm.to_mesh(arm_mesh)
    bm.free()
    apply_mat(arm_obj, mat_carbon_dark)
    add_bevel_and_smooth(arm_obj, width=0.018, segments=2)
    created_objects.append(arm_obj)

    # ---------------------------------------------------------------------
    # 3. Sculpted Top Galvan Armor Shell (Segmented Sci-Fi Carapace)
    # ---------------------------------------------------------------------
    plate_mesh = bpy.data.meshes.new("Mesh_TopArmorCarapace")
    plate_obj = bpy.data.objects.new("Ultimatrix_ArmorCarapace", plate_mesh)
    col.objects.link(plate_obj)
    
    bm_p = bmesh.new()
    # Contoured sections with angled taper towards wrist
    p_slices = [
        (-2.2, 1.34, 1.16, 120),  # Elbow wide shield
        (-1.2, 1.28, 1.12, 125),
        (-0.1, 1.20, 1.05, 130),  # Dial zone
        (0.8,  1.10, 0.94, 115),
        (1.5,  0.94, 0.82, 95),   # Wrist taper (V-shape cutout)
    ]
    p_rings = []
    arc_pts = 16
    for y_pos, rx, rz, arc_deg in p_slices:
        row = []
        half_arc = arc_deg / 2.0
        start_th = 90 - half_arc
        for i in range(arc_pts):
            th = math.radians(start_th + (arc_deg * i / (arc_pts - 1)))
            px = (rx + 0.035) * math.cos(th)
            pz = (rz + 0.045) * math.sin(th)
            v = bm_p.verts.new((px, y_pos, pz))
            row.append(v)
        p_rings.append(row)
        
    for r in range(len(p_rings) - 1):
        r1, r2 = p_rings[r], p_rings[r + 1]
        for i in range(arc_pts - 1):
            bm_p.faces.new([r1[i], r2[i], r2[i + 1], r1[i + 1]])
            
    # Solidify to give it real 3D armor thickness
    bmesh.ops.solidify(bm_p, geom=bm_p.faces, thickness=0.07)
    bm_p.to_mesh(plate_mesh)
    bm_p.free()
    apply_mat(plate_obj, mat_galvan_green)
    add_bevel_and_smooth(plate_obj, width=0.018, segments=2)
    created_objects.append(plate_obj)

    # ---------------------------------------------------------------------
    # 4. Integrated Cuffs (Forearm & Wrist Hollow Trim Bands)
    # ---------------------------------------------------------------------
    # Wrist Cuff (Hollow Torus)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.98, minor_radius=0.065, major_segments=48, minor_segments=16,
        location=(0, 1.80, -0.02), rotation=(math.radians(90), 0, 0)
    )
    cuff_w = bpy.context.active_object
    cuff_w.name = "Ultimatrix_WristCuff"
    cuff_w.scale = (1.0, 0.88, 1.0)
    apply_mat(cuff_w, mat_chrome_trim)
    add_bevel_and_smooth(cuff_w, width=0.015, segments=2)
    created_objects.append(cuff_w)

    # Elbow Cuff (Hollow Torus)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.38, minor_radius=0.08, major_segments=48, minor_segments=16,
        location=(0, -2.40, 0.0), rotation=(math.radians(90), 0, 0)
    )
    cuff_e = bpy.context.active_object
    cuff_e.name = "Ultimatrix_ElbowCuff"
    cuff_e.scale = (1.0, 0.84, 1.0)
    apply_mat(cuff_e, mat_chrome_trim)
    add_bevel_and_smooth(cuff_e, width=0.018, segments=2)
    created_objects.append(cuff_e)

    # Underside Grip Bands
    for y_strap in [-1.5, -0.5, 0.5]:
        bpy.ops.mesh.primitive_torus_add(
            major_radius=1.15, minor_radius=0.04, major_segments=36, minor_segments=12,
            location=(0, y_strap, -0.05), rotation=(math.radians(90), 0, 0)
        )
        strap = bpy.context.active_object
        strap.name = f"Underside_Strap_{y_strap}"
        strap.scale = (1.02, 0.86, 1.0)
        apply_mat(strap, mat_carbon_dark)
        created_objects.append(strap)

    # ---------------------------------------------------------------------
    # 5. Glowing Power Circuit Inlays (Recessed channels)
    # ---------------------------------------------------------------------
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(
            size=1.0,
            location=(side * 0.82, -0.3, 1.10),
            scale=(0.04, 2.6, 0.03),
            rotation=(0, side * math.radians(2), 0)
        )
        circuit = bpy.context.active_object
        circuit.name = f"Ultimatrix_Circuit_{'R' if side > 0 else 'L'}"
        apply_mat(circuit, mat_omni_glow)
        created_objects.append(circuit)

    # ---------------------------------------------------------------------
    # 6. Central Dial Console Housing Unit (Centered at X=0, Y=-0.1, Z=1.12)
    # ---------------------------------------------------------------------
    # Housing Pedestal Ring
    bpy.ops.mesh.primitive_cylinder_add(
        radius=1.28, depth=0.22, vertices=64,
        location=(0, -0.1, 1.12)
    )
    housing_base = bpy.context.active_object
    housing_base.name = "Ultimatrix_HousingBase"
    apply_mat(housing_base, mat_carbon_dark)
    add_bevel_and_smooth(housing_base, width=0.015, segments=2)
    created_objects.append(housing_base)

    # Outer Chrome Ring Collar
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.26, minor_radius=0.055, major_segments=48, minor_segments=16,
        location=(0, -0.1, 1.22)
    )
    housing_ring = bpy.context.active_object
    housing_ring.name = "Ultimatrix_HousingSilverCollar"
    apply_mat(housing_ring, mat_chrome_trim)
    created_objects.append(housing_ring)

    # 4 Indicator Nodes on Housing Collar
    for i in range(4):
        ang = (i * math.pi / 2) + (math.pi / 4)
        nx = 1.20 * math.cos(ang)
        ny = -0.1 + 1.20 * math.sin(ang)
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.07, depth=0.06, vertices=24,
            location=(nx, ny, 1.24)
        )
        node = bpy.context.active_object
        node.name = f"Housing_Node_{i+1}"
        apply_mat(node, mat_omni_glow)
        created_objects.append(node)

    # ---------------------------------------------------------------------
    # 7. Four Evolutionary Ultimate Spikes (Iconic sleek angular daggers)
    # ---------------------------------------------------------------------
    # Each spike is a sharp, diamond-profile blade extending outward
    spike_angles = [math.pi/4, 3*math.pi/4, 5*math.pi/4, 7*math.pi/4]
    for idx, ang in enumerate(spike_angles):
        sp_mesh = bpy.data.meshes.new(f"Mesh_Spike_{idx+1}")
        sp_obj = bpy.data.objects.new(f"Ultimatrix_EvolutionSpike_{idx+1}", sp_mesh)
        col.objects.link(sp_obj)
        
        # Blade geometry: base at origin pointing along +Y
        # Diamond cross section tapering to tip
        sp_verts = [
            # Base ring
            (-0.12, 0.0, 0.0), (0.0, 0.0, 0.08), (0.12, 0.0, 0.0), (0.0, 0.0, -0.08),
            # Mid swell
            (-0.16, 0.45, 0.0), (0.0, 0.45, 0.10), (0.16, 0.45, 0.0), (0.0, 0.45, -0.10),
            # Tip
            (0.0, 1.15, 0.0)
        ]
        sp_faces = [
            # Base to mid
            (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
            # Mid to tip
            (4, 8, 5), (5, 8, 6), (6, 8, 7), (7, 8, 4),
            # Back cap
            (3, 2, 1, 0)
        ]
        sp_mesh.from_pydata(sp_verts, [], sp_faces)
        sp_mesh.update()
        
        # Position at housing edge
        dist = 1.25
        sp_obj.location = (dist * math.cos(ang), -0.1 + dist * math.sin(ang), 1.18)
        # Rotate pointing outward and angled slightly up (25 deg)
        yaw = ang - (math.pi / 2)
        pitch = math.radians(22)
        sp_obj.rotation_euler = (
            pitch * math.sin(ang),
            -pitch * math.cos(ang),
            yaw
        )
        apply_mat(sp_obj, mat_chrome_trim)
        add_bevel_and_smooth(sp_obj, width=0.008, segments=2)
        created_objects.append(sp_obj)

    # ---------------------------------------------------------------------
    # 8. Rotating Bezel Turret & Knurled Grips
    # ---------------------------------------------------------------------
    # Raised Turret Collar
    bpy.ops.mesh.primitive_cylinder_add(
        radius=1.02, depth=0.24, vertices=64,
        location=(0, -0.1, 1.28)
    )
    turret = bpy.context.active_object
    turret.name = "Ultimatrix_DialTurret"
    apply_mat(turret, mat_carbon_dark)
    add_bevel_and_smooth(turret, width=0.012, segments=2)
    created_objects.append(turret)

    # Silver Outer Bezel
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.94, depth=0.14, vertices=64,
        location=(0, -0.1, 1.40)
    )
    bezel = bpy.context.active_object
    bezel.name = "Ultimatrix_BezelRing"
    apply_mat(bezel, mat_chrome_trim)
    add_bevel_and_smooth(bezel, width=0.01, segments=2)
    created_objects.append(bezel)

    # 24 Precision Grip Ridges around Bezel
    for i in range(24):
        th = i * (2 * math.pi / 24)
        rx = 0.94 * math.cos(th)
        ry = -0.1 + 0.94 * math.sin(th)
        bpy.ops.mesh.primitive_cube_add(
            size=1.0,
            location=(rx, ry, 1.40),
            scale=(0.025, 0.04, 0.12),
            rotation=(0, 0, th)
        )
        ridge = bpy.context.active_object
        ridge.name = f"Bezel_Grip_{i}"
        apply_mat(ridge, mat_carbon_dark)
        created_objects.append(ridge)

    # ---------------------------------------------------------------------
    # 9. Dial Core Faceplate & Crisp Ben 10 Hourglass Emblem
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.82, depth=0.06, vertices=64,
        location=(0, -0.1, 1.46)
    )
    face = bpy.context.active_object
    face.name = "Ultimatrix_DialFaceplate"
    apply_mat(face, mat_dial_core)
    created_objects.append(face)

    # Two Inward Glowing Green Wedges (The Ben 10 Omnitrix / Ultimatrix Symbol)
    for mirror in [1, -1]:
        m = bpy.data.meshes.new(f"Mesh_Hourglass_{'Top' if mirror > 0 else 'Bottom'}")
        o = bpy.data.objects.new(f"Ultimatrix_Hourglass_{'Top' if mirror > 0 else 'Bottom'}", m)
        col.objects.link(o)
        
        yc = -0.1
        yt = yc + (0.04 * mirror)
        yb = yc + (0.54 * mirror)
        xw = 0.46
        z0, z1 = 1.48, 1.51
        
        v = [
            (0.0, yt, z0), (-xw, yb, z0), (xw, yb, z0),
            (0.0, yt, z1), (-xw, yb, z1), (xw, yb, z1),
        ]
        f = [(0, 1, 2), (3, 5, 4), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
        m.from_pydata(v, [], f)
        m.update()
        apply_mat(o, mat_omni_glow)
        add_bevel_and_smooth(o, width=0.006, segments=2)
        created_objects.append(o)

    # Complementary Black Inlay Wedges
    for mirror_x in [1, -1]:
        m = bpy.data.meshes.new(f"Mesh_Flank_{'R' if mirror_x > 0 else 'L'}")
        o = bpy.data.objects.new(f"Ultimatrix_Flank_{'R' if mirror_x > 0 else 'L'}", m)
        col.objects.link(o)
        
        yc = -0.1
        xt = 0.04 * mirror_x
        xb = 0.54 * mirror_x
        yw = 0.46
        z0, z1 = 1.48, 1.505
        
        v = [
            (xt, yc, z0), (xb, yc - yw, z0), (xb, yc + yw, z0),
            (xt, yc, z1), (xb, yc - yw, z1), (xb, yc + yw, z1),
        ]
        f = [(0, 1, 2), (3, 5, 4), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
        m.from_pydata(v, [], f)
        m.update()
        apply_mat(o, mat_dial_core)
        add_bevel_and_smooth(o, width=0.006, segments=2)
        created_objects.append(o)

    # Protective Glass Dome Lens over Dial
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.81, depth=0.02, vertices=48,
        location=(0, -0.1, 1.52)
    )
    lens = bpy.context.active_object
    lens.name = "Ultimatrix_DialLens"
    apply_mat(lens, mat_glass)
    created_objects.append(lens)

    # ---------------------------------------------------------------------
    # 10. Studio Lighting & Viewport Configuration
    # ---------------------------------------------------------------------
    setup_environment(col)

def setup_environment(col):
    # Key Light
    bpy.ops.object.light_add(type='AREA', location=(3.2, -3.4, 4.2))
    key = bpy.context.active_object
    key.name = "Studio_KeyLight"
    key.data.energy = 220.0
    key.data.size = 2.5
    
    # Cool Rim Light
    bpy.ops.object.light_add(type='AREA', location=(-3.2, 2.5, 3.5))
    fill = bpy.context.active_object
    fill.name = "Studio_RimLight"
    fill.data.energy = 90.0
    fill.data.size = 3.0
    fill.data.color = (0.7, 0.85, 1.0)
    
    # Top Core Accent Light
    bpy.ops.object.light_add(type='POINT', location=(0.0, -0.1, 2.4))
    accent = bpy.context.active_object
    accent.name = "Studio_CoreAccent"
    accent.data.energy = 40.0
    accent.data.color = (0.2, 1.0, 0.3)

    # Cinematic Camera Framing with Target Tracking
    empty = bpy.data.objects.new("Cam_Target", None)
    col.objects.link(empty)
    empty.location = (0, -0.2, 1.1)

    bpy.ops.object.camera_add(location=(3.8, -4.2, 3.6))
    cam = bpy.context.active_object
    cam.name = "Ultimatrix_StudioCamera"
    cam.data.lens = 50
    bpy.context.scene.camera = cam

    track = cam.constraints.new(type='TRACK_TO')
    track.target = empty
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'

    for item in [key, fill, accent, cam]:
        if item.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(item)
        if item.name not in col.objects:
            col.objects.link(item)

    # Configure 3D Viewport Shading for Instant High-Def Look
    for window in bpy.context.window_manager.windows:
        for area in window.screen.areas:
            if area.type == 'VIEW_3D':
                for space in area.spaces:
                    if space.type == 'VIEW_3D':
                        shading = space.shading
                        shading.color_type = 'MATERIAL' # Shows colors even in Solid mode!
                        shading.show_cavity = True      # Sharp cavity shadows
                        shading.cavity_type = 'BOTH'
                        shading.curvature_ridge_factor = 1.5
                        shading.curvature_valley_factor = 1.0

if __name__ == "__main__":
    build_pro_ultimatrix()
    print("PRO Ultimatrix Gauntlet successfully built!")
    
    # Save the updated .blend file
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
    except Exception:
        script_dir = os.getcwd()
    blend_path = os.path.join(script_dir, "Ultimatrix.blend")
    try:
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print(f"Saved file: {blend_path}")
    except Exception as e:
        print(f"Save note: {e}")
