from typing import Optional
from dataclasses import dataclass


@dataclass
class ExifData:
    camera_make: Optional[str] = None
    camera_model: Optional[str] = None
    lens: Optional[str] = None
    focal_length: Optional[str] = None
    aperture: Optional[str] = None
    shutter_speed: Optional[str] = None
    iso: Optional[int] = None
    taken_at: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None


def extract_exif(file_bytes: bytes) -> ExifData:
    try:
        from PIL import Image
        from PIL.ExifTags import TAGS, GPSTAGS
        import io

        img = Image.open(io.BytesIO(file_bytes))
        exif_data = img._getexif()

        if not exif_data:
            return ExifData(
                width=img.width,
                height=img.height,
            )

        exif = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            exif[tag] = value

        width = img.width
        height = img.height

        camera_make = exif.get("Make")
        camera_model = exif.get("Model")
        lens = exif.get("LensModel")
        iso = exif.get("ISOSpeedRatings")

        focal_length = None
        if "FocalLength" in exif:
            fl = exif["FocalLength"]
            focal_length = f"{fl.numerator}/{fl.denominator}mm"

        aperture = None
        if "FNumber" in exif:
            fn = exif["FNumber"]
            aperture = f"f/{fn.numerator / fn.denominator:.1f}"

        shutter_speed = None
        if "ExposureTime" in exif:
            et = exif["ExposureTime"]
            if et.denominator > 0:
                speed = et.numerator / et.denominator
                if speed >= 1:
                    shutter_speed = f"{int(speed)}s"
                else:
                    shutter_speed = f"1/{int(1/speed)}s"

        taken_at = None
        if "DateTimeOriginal" in exif:
            taken_at = exif["DateTimeOriginal"]

        latitude = None
        longitude = None
        if "GPSInfo" in exif:
            gps_info = exif["GPSInfo"]
            gps = {}
            for key, val in gps_info.items():
                tag = GPSTAGS.get(key, key)
                gps[tag] = val

            if "GPSLatitude" in gps and "GPSLongitude" in gps:
                lat = gps["GPSLatitude"]
                lon = gps["GPSLongitude"]
                lat_ref = gps.get("GPSLatitudeRef", "N")
                lon_ref = gps.get("GPSLongitudeRef", "E")

                latitude = (
                    lat[0] + lat[1] / 60 + lat[2] / 3600
                )
                if lat_ref == "S":
                    latitude = -latitude

                longitude = (
                    lon[0] + lon[1] / 60 + lon[2] / 3600
                )
                if lon_ref == "W":
                    longitude = -longitude

        return ExifData(
            camera_make=camera_make,
            camera_model=camera_model,
            lens=lens,
            focal_length=focal_length,
            aperture=aperture,
            shutter_speed=shutter_speed,
            iso=iso,
            taken_at=taken_at,
            width=width,
            height=height,
            latitude=latitude,
            longitude=longitude,
        )

    except ImportError:
        return ExifData()
    except Exception:
        return ExifData()
