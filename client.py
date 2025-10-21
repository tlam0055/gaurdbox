
import base64
import sys
from typing import Tuple, Callable

import requests

SERVER_URL = "http://127.0.0.1:5000"


def fetch_server_pk(server_url: str) -> bytes:
    """GET /get_server_pk and return the public key as raw bytes."""
    r = requests.get(f"{server_url}/get_server_pk", timeout=5)
    r.raise_for_status()
    j = r.json()
    pk_hex = j.get("public_key")
    if not pk_hex or not isinstance(pk_hex, str):
        raise ValueError("Server response missing 'public_key' hex string")
    try:
        return bytes.fromhex(pk_hex)
    except ValueError as e:
        raise ValueError("Public key was not valid hex") from e


def get_kyber_backend() -> tuple[str, Callable[[bytes], Tuple[bytes, bytes]]]:
    """
    Return a (backend_name, encapsulate_fn) pair.
    encapsulate_fn(pk) -> (ciphertext, shared_secret)
    Prefers smaj_kyber to match the server; falls back to pqcrypto if available.
    """
    
    # 1) Try smaj_kyber (matches your Flask server)
    try:
        from smaj_kyber import set_mode  # type: ignore
        set_mode("512")  # align with server
        # Some releases use 'encapsulate', others 'encrypt'; detect dynamically.
        try:
            from smaj_kyber import encapsulate as _enc  # type: ignore
            def encapsulate_fn(pk: bytes) -> Tuple[bytes, bytes]:
                ct, ss = _enc(pk)
                return ct, ss
            return "smaj_kyber", encapsulate_fn
        except ImportError:
            from smaj_kyber import encrypt as _enc  # type: ignore
            def encapsulate_fn(pk: bytes) -> Tuple[bytes, bytes]:
                ct, ss = _enc(pk)
                return ct, ss
            return "smaj_kyber", encapsulate_fn
    except Exception:
        pass

    # 2) Fallback: pqcrypto (works on many envs, but Python 3.13 can be tricky)
    try:
        # Prefer importing the concrete submodule directly
        from pqcrypto.kem.kyber512 import encrypt as pq_encrypt  # type: ignore
        def encapsulate_fn(pk: bytes) -> Tuple[bytes, bytes]:
            ct, ss = pq_encrypt(pk)
            return ct, ss
        return "pqcrypto.kyber512", encapsulate_fn
    except Exception:
        # Last attempt: module import style (older docs)
        try:
            from pqcrypto.kem import kyber512  # type: ignore
            def encapsulate_fn(pk: bytes) -> Tuple[bytes, bytes]:
                ct, ss = kyber512.encrypt(pk)
                return ct, ss
            return "pqcrypto.kyber512", encapsulate_fn
        except Exception as e:
            raise ImportError(
                "No usable Kyber backend found. "
                "Install 'smaj_kyber' (preferred) or 'pqcrypto' that supports your Python."
            ) from e


def main():
    try:
        print("→ Fetching server public key...")
        pk = fetch_server_pk(SERVER_URL)
        print(f"  got {len(pk)} bytes")

        backend_name, encapsulate = get_kyber_backend()
        print(f"→ Using Kyber backend: {backend_name}")

        print("→ Encapsulating (deriving client shared secret)...")
        ct, ss = encapsulate(pk)

        # Pretty printing (hex + base64)
        ct_hex = ct.hex()
        ss_hex = ss.hex()
        ct_b64 = base64.b64encode(ct).decode()
        ss_b64 = base64.b64encode(ss).decode()

        print("\n=== CLIENT OUTPUT ===")
        print(f"Kyber Ciphertext (hex):   {ct_hex}")
        print(f"Kyber Ciphertext (b64):   {ct_b64}")
        print(f"Shared Secret (hex):      {ss_hex}")
        print(f"Shared Secret (b64):      {ss_b64}")
        print("======================\n")

        print(" Generated ciphertext + shared secret using the server's public key.")

    except Exception as e:
        print(f" Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
