"""
=============================================================================
  BEN 10 OMNITRIX 3D GENERATOR FOR BLENDER (Python Script)
  Compatible with Blender 3.x, 4.x, and 5.x
=============================================================================
How to run in Blender:
1. Open Blender.
2. Go to the "Scripting" workspace tab at the top.
3. Click "New" to create a new text file.
4. Paste this entire script into the editor.
5. Click the "Run Script" (Play) button or press Alt + P.
6. Switch Viewport Shading to "Material Preview" (Z -> Material Preview)
   or "Rendered" to see the glowing Omnitrix dial!
=============================================================================
"""

import bpy
import math

def clear_existing_omnitrix():
    """Removes previous Omnitrix collection if it exists to allow re-running."""
    col_name = "Omnitrix_Model"
    if col_name in bpy.data.collections:
        col = bpy.data.collections[col_name]
        for obj in list(col.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        bpy.data.collections.remove(col)

def create_collection(name):
    """Creates and links a dedicated collection."""
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    return col

# -------------------------------------------------------------------------
# Materials Helper (Cross-version compatible for Blender 3.x and 4.x+)
# -------------------------------------------------------------------------
def create_material(name, base_color, metallic=0.0, roughness=0.3, emission=None, emission_strength=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    output = nodes.new(type='ShaderNodeOutputMaterial')
    principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    mat.node_tree.links.new(principled.outputs['BSDF'], output.inputs['Surface'])
    
    if "Base Color" in principled.inputs:
        principled.inputs["Base Color"].default_value = base_color
    if "Metallic" in principled.inputs:
        principled.inputs["Metallic"].default_value = metallic
    if "Roughness" in principled.inputs:
        principled.inputs["Roughness"].default_value = roughness
        
    if emission:
        # Cross-version check: 4.0 uses 'Emission Color', 3.x uses 'Emission'
        if "Emission Color" in principled.inputs:
            principled.inputs["Emission Color"].default_value = emission
        elif "Emission" in principled.inputs:
            principled.inputs["Emission"].default_value = emission
            
        if "Emission Strength" in principled.inputs:
            principled.inputs["Emission Strength"].default_value = emission_strength
            
    return mat

def apply_material(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

def smooth_and_bevel(obj, bevel_width=0.015, segments=2):
    """Applies smooth shading and a subtle bevel modifier for realistic edges."""
    bpy.context.view_layer.objects.active = obj
    for poly in obj.data.polygons:
        poly.use_smooth = True
        
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = bevel_width
    mod.segments = segments
    mod.limit_method = 'ANGLE'

# -------------------------------------------------------------------------
# Main Omnitrix Builder
# -------------------------------------------------------------------------
def build_omnitrix():
    clear_existing_omnitrix()
    col = create_collection("Omnitrix_Model")
    
    # 1. Setup Materials
    # Dark Gunmetal / Charcoal Base
    mat_dark = create_material("Omnitrix_DarkGrey", (0.07, 0.08, 0.08, 1.0), metallic=0.4, roughness=0.35)
    # White / Light Platinum Dial Ring
    mat_white = create_material("Omnitrix_WhiteCollar", (0.85, 0.88, 0.90, 1.0), metallic=0.2, roughness=0.25)
    # Iconic Neon Green Glow
    mat_glow = create_material("Omnitrix_NeonGlow", (0.05, 1.0, 0.15, 1.0), metallic=0.0, roughness=0.1, 
                               emission=(0.1, 1.0, 0.2, 1.0), emission_strength=12.0)
    # Glossy Black Faceplate
    mat_black = create_material("Omnitrix_GlossyBlack", (0.02, 0.02, 0.02, 1.0), metallic=0.1, roughness=0.08)
    # Dark Forest Green Accents
    mat_green_dark = create_material("Omnitrix_DarkGreen", (0.02, 0.22, 0.05, 1.0), metallic=0.1, roughness=0.5)

    created_objects = []

    # ---------------------------------------------------------------------
    # 2. Wrist Band (Wrist gauntlet body)
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=1.2, 
        depth=1.8, 
        vertices=64, 
        location=(0, 0, 0),
        rotation=(math.radians(90), 0, 0)
    )
    band = bpy.context.active_object
    band.name = "Omnitrix_WristBand"
    apply_material(band, mat_dark)
    
    # Hollow out the inner wrist tunnel with boolean or scale
    bpy.ops.mesh.primitive_cylinder_add(
        radius=1.02, 
        depth=2.2, 
        vertices=64, 
        location=(0, 0, 0),
        rotation=(math.radians(90), 0, 0)
    )
    cutter = bpy.context.active_object
    cutter.name = "Wrist_Cutter"
    
    # Boolean Difference to hollow the wristband
    bool_mod = band.modifiers.new(name="HollowBand", type='BOOLEAN')
    bool_mod.operation = 'DIFFERENCE'
    bool_mod.object = cutter
    bpy.context.view_layer.objects.active = band
    bpy.ops.object.modifier_apply(modifier="HollowBand")
    bpy.data.objects.remove(cutter, do_unlink=True)
    
    smooth_and_bevel(band, bevel_width=0.02, segments=3)
    created_objects.append(band)

    # ---------------------------------------------------------------------
    # 3. Outer Band Grips / Accents (Green side ribbed pads)
    # ---------------------------------------------------------------------
    for side in [-1, 1]:
        bpy.ops.mesh.primitive_cube_add(
            size=1.0, 
            location=(side * 1.15, 0, 0),
            scale=(0.12, 0.7, 0.4)
        )
        grip = bpy.context.active_object
        grip.name = f"Omnitrix_Grip_{'R' if side > 0 else 'L'}"
        apply_material(grip, mat_green_dark)
        smooth_and_bevel(grip, bevel_width=0.03, segments=2)
        created_objects.append(grip)

    # ---------------------------------------------------------------------
    # 4. Watch Base Mount / Core Collar (Raised mount on top of wrist)
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.9, 
        depth=0.3, 
        vertices=48, 
        location=(0, 0, 1.15)
    )
    mount = bpy.context.active_object
    mount.name = "Omnitrix_Mount"
    apply_material(mount, mat_dark)
    smooth_and_bevel(mount, bevel_width=0.02, segments=2)
    created_objects.append(mount)

    # ---------------------------------------------------------------------
    # 5. White Dial Collar Ring (The iconic white base ring with 4 buttons)
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.82, 
        depth=0.22, 
        vertices=48, 
        location=(0, 0, 1.30)
    )
    white_collar = bpy.context.active_object
    white_collar.name = "Omnitrix_WhiteRing"
    apply_material(white_collar, mat_white)
    smooth_and_bevel(white_collar, bevel_width=0.015, segments=2)
    created_objects.append(white_collar)

    # ---------------------------------------------------------------------
    # 6. Four Selection Buttons (At 0°, 90°, 180°, 270° on the white ring)
    # ---------------------------------------------------------------------
    button_angles = [0, 90, 180, 270]
    for idx, deg in enumerate(button_angles):
        rad = math.radians(deg)
        dist = 0.82
        bx = dist * math.cos(rad)
        by = dist * math.sin(rad)
        
        bpy.ops.mesh.primitive_cube_add(
            size=1.0, 
            location=(bx, by, 1.32),
            scale=(0.08, 0.12, 0.14),
            rotation=(0, 0, rad)
        )
        btn = bpy.context.active_object
        btn.name = f"Omnitrix_Button_{idx+1}"
        apply_material(btn, mat_glow)
        smooth_and_bevel(btn, bevel_width=0.015, segments=2)
        created_objects.append(btn)

    # ---------------------------------------------------------------------
    # 7. Rotating Outer Bezel Ring (Black/Charcoal notched bezel)
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.72, 
        depth=0.18, 
        vertices=48, 
        location=(0, 0, 1.42)
    )
    bezel = bpy.context.active_object
    bezel.name = "Omnitrix_Bezel"
    apply_material(bezel, mat_dark)
    smooth_and_bevel(bezel, bevel_width=0.015, segments=2)
    created_objects.append(bezel)

    # Add 12 grip notches around the bezel ring
    for i in range(12):
        rad = math.radians(i * 30)
        nx = 0.72 * math.cos(rad)
        ny = 0.72 * math.sin(rad)
        bpy.ops.mesh.primitive_cube_add(
            size=1.0, 
            location=(nx, ny, 1.45),
            scale=(0.04, 0.06, 0.12),
            rotation=(0, 0, rad)
        )
        notch = bpy.context.active_object
        notch.name = f"Bezel_Notch_{i}"
        apply_material(notch, mat_green_dark)
        created_objects.append(notch)

    # ---------------------------------------------------------------------
    # 8. Inner Faceplate Disk (Glossy black base behind the hourglass)
    # ---------------------------------------------------------------------
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.58, 
        depth=0.08, 
        vertices=48, 
        location=(0, 0, 1.48)
    )
    faceplate = bpy.context.active_object
    faceplate.name = "Omnitrix_DialFace"
    apply_material(faceplate, mat_black)
    smooth_and_bevel(faceplate, bevel_width=0.01, segments=2)
    created_objects.append(faceplate)

    # ---------------------------------------------------------------------
    # 9. Iconic Hourglass Core Symbol (Two Glowing Green Inward Wedges)
    # ---------------------------------------------------------------------
    # We construct the 2 triangular wedges forming the Ben 10 hourglass
    for mirror in [1, -1]:
        mesh = bpy.data.meshes.new(f"Hourglass_Wedge_{'Top' if mirror > 0 else 'Bottom'}")
        obj = bpy.data.objects.new(mesh.name, mesh)
        col.objects.link(obj)
        
        # Vertices of an inward pointing triangle/wedge
        y_tip = 0.05 * mirror
        y_base = 0.46 * mirror
        x_wide = 0.38
        z_bottom = 1.50
        z_top = 1.53
        
        verts = [
            (0, y_tip, z_bottom),
            (-x_wide, y_base, z_bottom),
            (x_wide, y_base, z_bottom),
            (0, y_tip, z_top),
            (-x_wide, y_base, z_top),
            (x_wide, y_base, z_top),
        ]
        faces = [
            (0, 1, 2), # bottom
            (3, 5, 4), # top
            (0, 3, 4, 1), # left side
            (1, 4, 5, 2), # back side
            (2, 5, 3, 0), # right side
        ]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        apply_material(obj, mat_glow)
        smooth_and_bevel(obj, bevel_width=0.008, segments=2)
        created_objects.append(obj)

    # Side Black Wedges of the hourglass symbol (flanking the green wedges)
    for mirror_x in [1, -1]:
        mesh = bpy.data.meshes.new(f"Dial_BlackWedge_{'Right' if mirror_x > 0 else 'Left'}")
        obj = bpy.data.objects.new(mesh.name, mesh)
        col.objects.link(obj)
        
        x_tip = 0.05 * mirror_x
        x_base = 0.46 * mirror_x
        y_wide = 0.38
        z_bottom = 1.50
        z_top = 1.525
        
        verts = [
            (x_tip, 0, z_bottom),
            (x_base, -y_wide, z_bottom),
            (x_base, y_wide, z_bottom),
            (x_tip, 0, z_top),
            (x_base, -y_wide, z_top),
            (x_base, y_wide, z_top),
        ]
        faces = [
            (0, 1, 2),
            (3, 5, 4),
            (0, 3, 4, 1),
            (1, 4, 5, 2),
            (2, 5, 3, 0),
        ]
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        apply_material(obj, mat_black)
        smooth_and_bevel(obj, bevel_width=0.008, segments=2)
        created_objects.append(obj)

    # ---------------------------------------------------------------------
    # 10. Conduits / Power Tubes (Running along the sides of the wristband)
    # ---------------------------------------------------------------------
    for side in [-1, 1]:
        for tube_y in [-0.4, 0.4]:
            bpy.ops.mesh.primitive_cylinder_add(
                radius=0.04,
                depth=1.6,
                vertices=24,
                location=(side * 1.08, tube_y, 0.25),
                rotation=(math.radians(90), 0, 0)
            )
            tube = bpy.context.active_object
            tube.name = f"Omnitrix_Conduit_{'R' if side > 0 else 'L'}_{'F' if tube_y > 0 else 'B'}"
            apply_material(tube, mat_white)
            created_objects.append(tube)

    # Move created objects into the dedicated collection
    for obj in created_objects:
        if obj.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(obj)
        if obj.name not in col.objects:
            col.objects.link(obj)

    # ---------------------------------------------------------------------
    # 11. Studio Camera and Lighting Setup
    # ---------------------------------------------------------------------
    setup_studio_lighting(col)

def setup_studio_lighting(col):
    """Sets up a three-point lighting rig and camera targeting the Omnitrix."""
    # Key Light (Warm rim / illumination)
    bpy.ops.object.light_add(type='AREA', location=(2.5, -2.5, 3.5))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 150.0
    key_light.data.size = 2.0
    
    # Fill Light (Subtle cool fill)
    bpy.ops.object.light_add(type='AREA', location=(-2.5, -1.8, 2.5))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 60.0
    fill_light.data.size = 2.5
    fill_light.data.color = (0.7, 0.85, 1.0)
    
    # Top Rim Light (Accentuates the bevels and dial)
    bpy.ops.object.light_add(type='POINT', location=(0.0, 1.8, 3.2))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 80.0

    # Camera
    bpy.ops.object.camera_add(
        location=(2.2, -2.6, 2.8),
        rotation=(math.radians(55), 0, math.radians(40))
    )
    cam = bpy.context.active_object
    cam.name = "Omnitrix_Camera"
    bpy.context.scene.camera = cam

    # Link lights and camera to collection
    for item in [key_light, fill_light, rim_light, cam]:
        if item.name in bpy.context.scene.collection.objects:
            bpy.context.scene.collection.objects.unlink(item)
        if item.name not in col.objects:
            col.objects.link(item)

    # Enable Bloom / Ambient Occlusion for Eevee if supported
    scene = bpy.context.scene
    if hasattr(scene, 'eevee'):
        if hasattr(scene.eevee, 'use_bloom'):
            scene.eevee.use_bloom = True
        if hasattr(scene.eevee, 'use_gtao'):
            scene.eevee.use_gtao = True

# Execute
if __name__ == "__main__":
    build_omnitrix()
    print("Omnitrix model successfully generated!")
    
    # Save .blend file automatically if executed
    import os
    blend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Omnitrix.blend")
    try:
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print(f"Saved .blend file to: {blend_path}")
    except Exception as e:
        print(f"Note: Could not auto-save .blend file: {e}")

