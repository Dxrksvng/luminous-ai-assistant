"""
Application logger configuration
"""

import logging
import sys
from pathlib import Path

from core.config import settings


def setup_logger(name: str = "luminous") -> logging.Logger:
    """Setup and configure logger"""
    logger = logging.getLogger(name)

    # Set level based on debug mode
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)

    # Create formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console_handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(console_handler)

    return logger


# Create logger instance
logger = setup_logger()
