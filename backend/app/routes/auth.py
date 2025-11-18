from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, Token, UserResponse, Role
from app.database import db
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.find_one("users", {"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)

    new_user = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name,
        "role": user_data.role,
        "avatar": None,
    }

    db.insert_one("users", new_user)

    # Create access token
    access_token = create_access_token(
        data={"sub": user_id, "email": user_data.email, "role": user_data.role}
    )

    # Return user without password
    user_response = UserResponse(
        id=new_user["id"],
        email=new_user["email"],
        name=new_user["name"],
        role=new_user["role"],
        avatar=new_user.get("avatar"),
        createdAt=new_user["createdAt"],
        updatedAt=new_user["updatedAt"],
    )

    return Token(access_token=access_token, user=user_response)


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user"""
    # Find user by email
    user = db.find_one("users", {"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"], "role": user["role"]}
    )

    # Return user without password
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        avatar=user.get("avatar"),
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"],
    )

    return Token(access_token=access_token, user=user_response)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    user = db.find_one("users", {"id": current_user["id"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        avatar=user.get("avatar"),
        createdAt=user["createdAt"],
        updatedAt=user["updatedAt"],
    )
